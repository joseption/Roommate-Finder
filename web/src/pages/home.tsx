import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

import { SendSMSLink } from "../request/mutate";
const stats = [
  { label: "Founded", value: "2023" },
  { label: "Team size", value: "6" },
  { label: "Beta Users", value: "521" },
  { label: "Raised", value: "$25M" },
];
const footerNavigation = {
  main: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Jobs", href: "#" },
    { name: "Press", href: "#" },
    { name: "Accessibility", href: "#" },
    { name: "Partners", href: "#" },
  ],
  social: [
    {
      name: "Facebook",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Dribbble",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
};

const images = ["/splash1.png", "/splash3.png", "/splash4.png", "/splash6.png"];

export default function Example() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber("+1" + e.target.value);
  };
  console.log(phoneNumber);

  const { mutate: sendSMS, isLoading: smsLoading } = useMutation({
    mutationFn: (phoneNumber: string) => SendSMSLink(phoneNumber),
    onSuccess: () => {
      toast.success("SMS sent");
    },
    onError: (err: Error) => {
      toast.error(err.message);
      console.log(err);
    },
  });
  const handleFormsubmit = (e: React.FormEvent<HTMLFormElement>) => {
    sendSMS(phoneNumber);
  };

  return (
    <div className="bg-white">
      <main>
        {/* Hero section */}
        <div className="overflow-hidden pt-8 sm:pt-12 lg:relative lg:py-48">
          <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-24 lg:px-8">
            <div>
              <div>
                <img
                  className="h-11 w-auto"
                  src="/landingPageIcon.jpg"
                  alt="Workflow"
                />
              </div>
              <div className="mt-20">
                <div>
                  <a href="#" className="inline-flex space-x-4">
                    <span className="rounded bg-yellow-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-yellow-500">
                      whats news
                    </span>
                    <span className="inline-flex items-center space-x-1 text-sm font-medium text-yellow-500">
                      <span>Just shipped version 0.1.0</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </a>
                </div>
                <div className="mt-6 sm:max-w-xl">
                  <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                    The best way to find your next roommate
                  </h1>
                  <p className="mt-6 text-xl text-gray-500">
                    Do everything you need to find your next roommate in one
                    place. Have us match you with the perfect roommate, or
                    search for your own. Enter your number below to get sent a
                    link to download the app. You can also view potential
                    matches or listings on the web, but to actually message and
                    interact you&apos;ll need to use our app.
                  </p>
                </div>
                <form
                  action="#"
                  className="mt-12 sm:flex sm:w-full sm:max-w-lg"
                  onSubmit={(e) => handleFormsubmit(e)}
                >
                  <div className="min-w-0 flex-1">
                    <label htmlFor="hero-email" className="sr-only">
                      phone number
                    </label>
                    <input
                      id="hero-number"
                      type="number"
                      className="block w-full rounded-md border border-gray-300 px-5 py-3 text-base text-gray-900 shadow-sm placeholder:text-gray-500 focus:border-yellow-500 focus:ring-yellow-500"
                      placeholder="Enter your number"
                      onChange={(e) => handlePhoneChange(e)}
                    />
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-3">
                    <button
                      type="submit"
                      className="block w-full rounded-md border border-transparent bg-yellow-500 px-5 py-3 text-base font-medium text-white shadow hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:px-10"
                    >
                      Go
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="sm:mx-auto sm:max-w-3xl sm:px-6">
            <div className="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
              <div className="relative -mr-40 pl-4 sm:mx-auto sm:max-w-3xl sm:px-0 lg:h-full lg:max-w-none lg:pl-12">
                <img
                  className="mx-auto w-full rounded-md shadow-xl ring-1 ring-black ring-opacity-5 lg:h-full lg:w-auto lg:max-w-none"
                  src="/coffee.jpg"
                  alt="people"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial/stats section */}
        <div className="relative mt-20">
          <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:items-start lg:gap-24 lg:px-8">
            <div className="relative sm:py-16 lg:py-0">
              <div
                aria-hidden="true"
                className="hidden sm:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-screen"
              >
                <div className="absolute inset-y-0 right-1/2 w-full rounded-r-3xl bg-gray-50 lg:right-72" />
                <svg
                  className="absolute top-8 left-1/2 -ml-3 lg:-right-8 lg:left-auto lg:top-12"
                  width={404}
                  height={392}
                  fill="none"
                  viewBox="0 0 404 392"
                >
                  <defs>
                    <pattern
                      id="02f20b47-fd69-4224-a62a-4c9de5c763f7"
                      x={0}
                      y={0}
                      width={20}
                      height={20}
                      patternUnits="userSpaceOnUse"
                    >
                      <rect
                        x={0}
                        y={0}
                        width={4}
                        height={4}
                        className="text-gray-200"
                        fill="currentColor"
                      />
                    </pattern>
                  </defs>
                  <rect
                    width={404}
                    height={392}
                    fill="url(#02f20b47-fd69-4224-a62a-4c9de5c763f7)"
                  />
                </svg>
              </div>
              <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-none lg:px-0 lg:py-20">
                {/* Testimonial card*/}
                <div className="relative overflow-hidden rounded-2xl pt-64 pb-10 shadow-xl">
                  <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src="/studentheadphones.jpg"
                    alt=""
                  />
                  <div className="absolute inset-0 bg-yellow-500 mix-blend-multiply" />
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-600 via-yellow-600 opacity-90" />
                  <div className="relative px-8">
                    <blockquote className="mt-8">
                      <div className="relative text-lg font-medium text-white md:grow">
                        <p className="relative">
                          As someone who spends most of my time in my apartment
                          working on side projects or classwork, finding a good
                          roommate who is respectful and considerate is a must.
                          During my first year at UCF, I had a roommate who was
                          constantly loud and would play music at all hours of
                          the night. I was able to find a new roommate through
                          Roommate Finder and have had a much better experience
                          since.
                        </p>
                      </div>

                      <footer className="mt-4">
                        <p className="text-base font-semibold text-yellow-200">
                          UCF Student
                        </p>
                      </footer>
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0">
              {/* Content area */}
              <div className="pt-12 sm:pt-16 lg:pt-20">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  How it works
                </h2>
                <div className="mt-6 space-y-6 text-gray-500">
                  <p className="text-base leading-7">
                    UCF students can sign up for an account with our service
                    using an active @knights.ucf.edu email address. Once you
                    have an account, you can create a profile and fill out a
                    short survey indicating your preferences in a roommate. This
                    will generate your match percentage to other users in our
                    service. The survey is optional, but we recommend filling it
                    out to get the best results.
                  </p>
                  <p className="text-base leading-7">
                    Now you can explore different profiles with the ability to
                    filter on things you care about the most. If you aren&apos;t
                    looking for a roommate, and just need housing, you can go
                    straight to the listing portion of our app.
                  </p>
                  <p className="text-base leading-7">
                    Once you&apos;ve found a potential roommate or listing that
                    might be a good fit, you can directly message them through
                    our service without having to reveal your personal phone or
                    email. Then proceed to check out listings with your new
                    potential roommate.
                  </p>
                </div>
              </div>

              {/* Stats section */}
              <div className="mt-10">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-8">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="border-t-2 border-gray-100 pt-6"
                    >
                      <dt className="text-base font-medium text-gray-500">
                        {stat.label}
                      </dt>
                      <dd className="text-3xl font-extrabold tracking-tight text-gray-900">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-10">
                  <a href="#" className="text-base font-medium text-yellow-500">
                    Learn more
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* things to do on site */}
        <div className="mt-32">
          <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-24">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Set up your profile
                </h2>
                <p className="mt-6 max-w-3xl text-lg leading-7 text-gray-500">
                  Fill out your profile with your interests and a bio.
                </p>
                <h2 className="my-5 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Match with people
                </h2>
                <p className="mt-6 max-w-3xl text-lg leading-7 text-gray-500">
                  After filling out our survey, you&apos;ll be matched with
                  people who have similar interests.
                </p>
                <h2 className="my-5 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Chat with potential roommates
                </h2>
                <p className="mt-6 max-w-3xl text-lg leading-7 text-gray-500">
                  If you see a profile or match that might be a good fit,
                  message them directly and see if you&apos;re a good fit
                  without having to reveal private information like your phone
                  number or social media.
                </p>
                <h2 className="my-5 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Find your next home
                </h2>
                <p className="mt-6 max-w-3xl text-lg leading-7 text-gray-500">
                  Search through potential places to live with options varying
                  from individual rooms to entire homes.
                </p>
                <h2 className="my-5 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Use only what you need
                </h2>
                <p className="mt-6 max-w-3xl text-lg leading-7 text-gray-500">
                  All our services aren&apos;t mutually inclusive, so you can
                  use just the roommate finder or just the housing listings.
                  We&apos;re here to help you find the best fit for you!
                </p>
              </div>
              <div className="relative mt-12 lg:mt-0">
                <img
                  className=""
                  src={images[currentImageIndex]}
                  alt="listings"
                />
                <button
                  className="absolute top-1/2 left-0 -translate-y-1/2 bg-white px-3 py-2 opacity-70 hover:opacity-100 focus:outline-none"
                  onClick={handlePrevImage}
                >
                  &lt;
                </button>
                <button
                  className="absolute top-1/2 right-0 -translate-y-1/2 bg-white px-3 py-2 opacity-70 hover:opacity-100 focus:outline-none"
                  onClick={handleNextImage}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer section */}
      <footer className="mt-24 bg-gray-900 sm:mt-12">
        <div className="mx-auto max-w-md overflow-hidden py-12 px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
          <nav
            className="-mx-5 -my-2 flex flex-wrap justify-center"
            aria-label="Footer"
          >
            {footerNavigation.main.map((item) => (
              <div key={item.name} className="px-5 py-2">
                <a
                  href={item.href}
                  className="text-base text-gray-400 hover:text-gray-300"
                >
                  {item.name}
                </a>
              </div>
            ))}
          </nav>
          <div className="mt-8 flex justify-center space-x-6">
            {footerNavigation.social.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-400 hover:text-gray-300"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
          <p className="mt-8 text-center text-base text-gray-400">
            All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
