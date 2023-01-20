import ProfilePicture from "../../components/Settings/ProfilePicture";
import SettingsSection from "../../components/Settings/rows";

export default function Settings() {
  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="mx-auto flex max-w-4xl flex-col md:px-8 xl:px-0">
          <main className="flex-1">
            <div className="relative mx-auto max-w-4xl md:px-8 xl:px-0">
              <div className="pt-10 pb-16">
                <div className="px-4 sm:px-6 md:px-0">
                  <h1 className="text-3xl font-extrabold text-gray-900">
                    Settings
                  </h1>
                </div>
                <div className="px-4 sm:px-6 md:px-0">
                  <div className="py-6">
                    {/* Description list with inline editing */}
                    <div className="mt-10 divide-y divide-gray-200">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Profile
                        </h3>
                        <p className="max-w-2xl text-sm text-gray-500">
                          This information will be displayed publicly so be
                          careful what you share.
                        </p>
                      </div>
                      <div className="mt-6">
                        <dl className="divide-y divide-gray-200">
                          <ProfilePicture Name="Profile Picture" Value="" />
                          <SettingsSection Name="First Name" Value="Faiz" />
                          <SettingsSection Name="Last Name" Value="Ahmed" />
                          <SettingsSection
                            Name="Email"
                            Value="faiz@faiz.info"
                          />
                          <SettingsSection Name="Gender" Value="Male" />
                          <SettingsSection Name="Birthday" Value="10/10/1990" />
                          <SettingsSection Name="Phone" Value="1234567890" />
                        </dl>
                      </div>
                    </div>

                    <div className="mt-10 divide-y divide-gray-200">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Location
                        </h3>
                        <p className="max-w-2xl text-sm text-gray-500">
                          Easily customize your location preferences.
                        </p>
                      </div>
                      <div className="mt-6">
                        <dl className="divide-y divide-gray-200">
                          <SettingsSection Name="City" Value="Oviedo" />
                          <SettingsSection Name="State" Value="FL" />
                          <SettingsSection Name="Zip-Code" Value="32765" />
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
