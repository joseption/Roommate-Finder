import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import toast from "react-hot-toast";

import { login, register, reset } from "../request/mutate";
import { storeAuthSession } from "../utils/storage";
type Action = "login" | "register" | "reset";
export default function Login() {
  const router = useRouter();
  const [action, setAction] = useState<Action>("login");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const isDisabled = false;

  const emailInvalid = email.trim() === "" || !email.includes("@");
  const emailHelperText = emailInvalid ? "Invalid email" : "";
  const passwordInvalid = password.length < 8 && action === "register";
  const passwordHelperText = passwordInvalid
    ? "Password must be at least 8 characters"
    : "";

  const confirmPasswordInvalid =
    (!confirmPassword || confirmPassword !== password) && action === "register";
  const confirmPasswordHelperText = confirmPasswordInvalid
    ? "Passwords do not match"
    : "";

  const { mutate: mutateLogin, isLoading: isLoggingIn } = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      storeAuthSession(data);
      if (!data.user?.is_verified) {
        void router.push({
          pathname: "/auth/confirmEmail",
          query: { email: email },
        });
      } else if (!data.user?.is_setup) {
        void router.push("/setup/profile");
      } else void router.push("/explore");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const { mutate: mutateRegister, isLoading: isRegistering } = useMutation({
    mutationFn: () => register(email, password, name, lastName),
    onSuccess: (data) => {
      storeAuthSession(data);
      void router.push({
        pathname: "/auth/confirmEmail",
        query: { email: email },
      });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const { mutate: mutateReset, isLoading: isReseting } = useMutation({
    mutationFn: () => reset(email),
    onSuccess: (data) => {
      storeAuthSession(data);
      void router.push({
        pathname: "/auth/sentReset",
        query: { email: email },
      });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (action === "login") {
      if (!emailInvalid && !passwordInvalid) {
        mutateLogin();
      }
    }
    if (action === "register") {
      if (!emailInvalid && !passwordInvalid && !confirmPasswordInvalid) {
        mutateRegister();
      }
    }
    if (action === "reset") {
      if (!emailInvalid) {
        mutateReset();
      }
    }
  };

  return (
    <>
      <main className="h-full bg-white">
        <div className=" flex h-screen justify-center">
          <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              <div>
                <Image
                  className="h-12 w-auto"
                  src="/RoomFin/Logo/SVG FIles/logo-01.svg"
                  width={200}
                  height={200}
                  alt="Logo"
                ></Image>

                {action === "login" && (
                  <>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                      Sign in to your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                      Or{" "}
                      <a
                        href="#"
                        className="font-medium text-yellow-600 hover:text-yellow-500"
                        onClick={() => setAction("register")}
                      >
                        Create a new account
                      </a>
                    </p>
                  </>
                )}
                {action === "register" && (
                  <>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                      Create a new account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                      Or{" "}
                      <a
                        href="#"
                        className="font-medium text-yellow-600 hover:text-yellow-500"
                        onClick={() => setAction("login")}
                      >
                        Go back to login.
                      </a>
                    </p>
                  </>
                )}
                {action === "reset" && (
                  <>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                      Reset Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                      Or{" "}
                      <a
                        href="#"
                        className="font-medium text-yellow-600 hover:text-yellow-500"
                        onClick={() => setAction("login")}
                      >
                        Go back to login.
                      </a>
                    </p>
                  </>
                )}
              </div>

              <div className="mt-8">
                <div className="mt-6">
                  <form
                    onSubmit={handleSubmit}
                    method="POST"
                    className="space-y-6"
                  >
                    {action === "register" && (
                      <div className="space-y-1">
                        <label
                          htmlFor="First Name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          First Name
                        </label>
                        <div className="mt-1">
                          <input
                            id="Name"
                            name="Name"
                            type="text"
                            autoComplete="First Name"
                            required
                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm"
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {action === "register" && (
                      <div className="space-y-1">
                        <label
                          htmlFor="Last Name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Last Name
                        </label>
                        <div className="mt-1">
                          <input
                            id="Last Name"
                            name="Last Name"
                            type="text"
                            autoComplete="Last Name"
                            required
                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm"
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email address
                      </label>
                      <div className="mt-1">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    {action != "reset" && (
                      <div className="space-y-1">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Password
                        </label>
                        <div className="mt-1">
                          <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm"
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                    {action === "register" && (
                      <div className="space-y-1">
                        <label
                          htmlFor="confirm-password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Confirm Password
                        </label>
                        <div className="mt-1">
                          <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <a
                          href="#"
                          className="font-medium text-yellow-600 hover:text-yellow-500"
                        ></a>
                      </div>
                      {action === "login" && (
                        <div className="text-sm">
                          <a
                            href="#"
                            className="font-medium text-yellow-600 hover:text-yellow-500"
                            onClick={() => setAction("reset")}
                          >
                            Forgot your password?
                          </a>
                        </div>
                      )}
                    </div>

                    <div>
                      {action === "login" && (
                        <button
                          type="submit"
                          disabled={isLoggingIn}
                          className="flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Sign in
                        </button>
                      )}
                      {action === "register" && (
                        <button
                          type="submit"
                          disabled={isRegistering}
                          className="flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Sign up
                        </button>
                      )}
                      {action === "reset" && (
                        <button
                          type="submit"
                          disabled={isReseting}
                          className="flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Send me a recovery link
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="relative hidden w-0 flex-1 lg:block">
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1662942034939-7c3ca28c5ece?ixlib=rb-4.0.3&dl=rich-togrophy-_swUjy2quls-unsplash.jpg&q=80&fm=jpg&crop=entropy&cs=tinysrgb"
              alt=""
            />
          </div>
        </div>
      </main>
    </>
  );
}
