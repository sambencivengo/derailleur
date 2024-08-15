import { v4 as uuid } from 'uuid';
import { S3Client, PutObjectCommand, PutObjectCommandInput, PutObjectCommandOutput } from '@aws-sdk/client-s3';
import { createDerailleurError, createErrorResponse, createNextResponse, createSuccessfulResponse, DerailleurResponse } from "~/utils";

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPE = 'image/jpeg';

const s3Client = new S3Client({
  region: process.env.AWS_REGION ?? '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  }
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll('files') as Array<File>;
  const { errors, result } = validateImagesAndReturnErrorResponse(files);

  if (errors.length > 0 || result === null) {
    return (createNextResponse({ errors, status: 400 }));
  }

  const fileNames: Array<string> = [];

  const imageUploadPromises: Array<Promise<PutObjectCommandOutput>> = files.map(async (image) => {
    const buffer = Buffer.from(await image.arrayBuffer());
    const fileName = `${uuid()}_${Date.now()}`;
    fileNames.push(fileName);
    return createImageCommandPromise(buffer, fileName);
  });

  try {
    await Promise.all(imageUploadPromises);
    return createNextResponse({ status: 200, result: fileNames });
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

function createImageCommandPromise(fileBuffer: Buffer, fileName: string): Promise<PutObjectCommandOutput> {
  const params: PutObjectCommandInput = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: "image/jpg",
  };
  const command = new PutObjectCommand(params);
  const imagePromise = s3Client.send(command);
  return imagePromise;
}

function sizeToMb(byteSize: number) {
  return (byteSize / 1024 / 1024);
}