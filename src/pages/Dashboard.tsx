import Card from "../components/Card";
import FullScreenImage from "../components/FullScreenImage";
import useUserInfo from "../hooks/useUserInfo";

export default function Dashboard() {
  const user = useUserInfo();

  return (
    <FullScreenImage>
      <div className="min-h-screen flex justify-center items-center">
        <Card className="w-[40rem]">
          <Card.Title>Userinfo:</Card.Title>
          <div className="text-lg text-slate-200">
            <div><strong>Id: </strong>{user?.id}</div>
            <div><strong>Username: </strong>{user?.username}</div>
            <div><strong>Global name: </strong>{user?.globalName}</div>
            <div><strong>Created at: </strong>{user?.createdAt.toString()}</div>
          </div>
        </Card>
      </div>
    </FullScreenImage>
  );
}
