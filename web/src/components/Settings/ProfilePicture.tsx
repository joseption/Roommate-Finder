interface Props {
  Name: string;
  Value: string;
}

export default function ProfilePicture({ Name, Value }: Props) {
  return (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
      <dt className="text-sm font-medium text-gray-500">{Name}</dt>
      <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
        <span className="grow">
          <img
            className="h-8 w-8 rounded-full"
            src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
        </span>
        <span className="ml-4 flex shrink-0 items-start space-x-4">
          <button
            type="button"
            className="rounded-md bg-white font-medium text-black hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Update
          </button>
          <span className="text-gray-300" aria-hidden="true">
            |
          </span>
          <button
            type="button"
            className="rounded-md bg-white font-medium text-black hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Remove
          </button>
        </span>
      </dd>
    </div>
  );
}
