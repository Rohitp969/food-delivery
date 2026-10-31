import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LogOut } from "lucide-react";
import Button from "../ui/Button";
import { Panel } from "../ui/Display";
import { clearSession } from "../../lib/session";

const LogoutPanel = () => {
  const navigate = useNavigate();

  return (
    <Panel title="Log out" description="Log out of GoFood on this device. Your cart and orders stay saved.">
      <Button
        variant="secondary"
        icon={LogOut}
        onClick={() => {
          clearSession();
          toast.success("You're logged out");
          navigate("/login");
        }}
      >
        Log out
      </Button>
    </Panel>
  );
};

export default LogoutPanel;
