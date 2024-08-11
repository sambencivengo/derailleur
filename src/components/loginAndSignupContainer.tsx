interface LoginAndSignUpContainerProps {
  children: React.ReactNode;
}

export function LoginAndSignupContainer({ children }: LoginAndSignUpContainerProps) {
  return (
    <div className="mt-10 flex justify-center space-y-3">
      <div className="flex flex-col gap-2 w-full sm:w-5/12 px-5">{children}</div>
    </div>
  );
}
