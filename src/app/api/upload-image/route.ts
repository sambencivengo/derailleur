import { v4 as uuid } from 'uuid';
import sharp from 'sharp';
import { S3Client, PutObjectCommand, PutObjectCommandInput, PutObjectCommandOutput } from '@aws-sdk/client-s3';
import { createDerailleurError, createErrorResponse, createNextResponse, createSuccessfulResponse, DerailleurResponse } from "~/utils";

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPE = 'image/jpeg';

function getS3Client(): S3Client {
  const region = process.env.AWS_REGION;
  if (!region) throw new Error('AWS_REGION is required for uploads');
  return new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    }
  });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll('files') as Array<File>;
  const { errors, result } = validateImagesAndReturnErrorResponse(files);

  if (errors.length > 0 || result === null) {
    return (createNextResponse({ errors, status: 400 }));
  }

  const s3Client = getS3Client();
  const thumbnailFileName = `${process.env.NODE_ENV === 'production' ? '' : 'DEV_IMAGE_'}thumbnail_${uuid()}_${Date.now()}`;
  const fileNames: Array<string> = [];

  const imageUploadPromises: Array<Promise<PutObjectCommandOutput>> = files.map(async (image) => {
    const buffer = Buffer.from(await image.arrayBuffer());
    const fileName = `${process.env.NODE_ENV === 'production' ? '' : 'DEV_IMAGE_'}${uuid()}_${Date.now()}`;
    fileNames.push(fileName);
    return createImageCommandPromise(s3Client, buffer, fileName);
  });
  imageUploadPromises.push(createThumbnailImage(s3Client, files[0], thumbnailFileName));
  try {
    await Promise.all(imageUploadPromises);
    return createNextResponse({ status: 200, result: { thumbnailFileName, fileNames } });
  } catch (error: any) {
    return createNextResponse({ status: 500, errors: [createDerailleurError(`An error occurred when uploading image: ${error.toString()}`, {})] });
  }
};


function validateImagesAndReturnErrorResponse(files: Array<File>): DerailleurResponse<boolean> {
  if (files.length > 5) {
    return (createErrorResponse([{ message: "Cannot upload more than 5 images per post", data: {} }]));
  }
  for (let i = 0, limi = files.length; i < limi; i++) {
    const image = files[i];
    const data = { fileSize: `${sizeToMb(image.size)} MB`, fileType: image.type, fileName: image.name };
    if (image.type !== ACCEPTED_IMAGE_TYPE) {
      return (createErrorResponse([{ message: "File must be a JPEG (.jpg or .jpeg)", data }]));
    }
    if (image.size > MAX_IMAGE_SIZE) {
      return (createErrorResponse([{ message: "File cannot be larger than 4MB", data }]));
    }
  }
  return createSuccessfulResponse(true);
}

async function createThumbnailImage(s3Client: S3Client, image: File, thumbnailFileName: string): Promise<PutObjectCommandOutput> {
  const imageBuffer = Buffer.from(await image.arrayBuffer());
  const thumbnailBuffer = await sharp(imageBuffer).jpeg({
    quality: 70,
    mozjpeg: true
  }).resize(200, 200).toBuffer();

  return createImageCommandPromise(s3Client, thumbnailBuffer, thumbnailFileName);
};

function createImageCommandPromise(s3Client: S3Client, fileBuffer: Buffer, fileName: string): Promise<PutObjectCommandOutput> {
  const params: PutObjectCommandInput = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: "image/jpg",
  };
  const command = new PutObjectCommand(params);
  return s3Client.send(command);
}

function sizeToMb(byteSize: number) {
  return (byteSize / 1024 / 1024);
}