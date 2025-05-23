import Navbar from "../components/Navbar";
import ProfileImageForm from "../modules/Settings/components/ProfileImageForm";
import ContactsForm from "../modules/Settings/components/ContactsForm";
import SecurityForm from "../modules/Settings/components/SecurityForm";

const PageHeader = ({ title }: { title: string }) => {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold text-[#efeff1]">{title}</h1>
    </div>
  );
};

const SmallHeader = ({ content }: { content: string }) => {
  return <h1 className="text-xl font-semibold text-[#dedee3]">{content}</h1>;
};

const Settings = () => {
  return (
    <div className="flex flex-col h-[100dvh] min-w-2xl">
      <Navbar />

      <div className="flex-1 overflow-y-auto p-8 bg-[#0e0e10]">
        <PageHeader title="Settings" />

        <div className="flex flex-col space-y-8 max-w-5xl mx-auto">
          <SmallHeader content="Profile Picture" />
          <ProfileImageForm />

          <SmallHeader content="Contact" />
          <ContactsForm />

          <SmallHeader content="Security" />
          <SecurityForm />
        </div>
      </div>
    </div>
  );
};

export default Settings;
