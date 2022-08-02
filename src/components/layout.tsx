import { useActor } from "@xstate/react";
import React from "react";
import { Outlet } from "react-router-dom";
import { GlobalStateContext } from "../global-state";
import { Button } from "./button";

function Logo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16.623 2.543C15.643 1.073 14.082 0 12 0 9.918 0 8.357 1.072 7.377 2.543 6.427 3.969 6 5.777 6 7.5c0 2.452.689 4.725 1.894 6.721a10.733 10.733 0 0 0 2.29-2.085C9.42 10.694 9 9.123 9 7.5c0-1.277.324-2.47.873-3.293a3.55 3.55 0 0 1 .203-.276C10.568 3.328 11.196 3 12 3c.918 0 1.607.428 2.127 1.207.55.824.873 2.016.873 3.293 0 6.392-6.593 12-15 12v3c9.443 0 18-6.392 18-15 0-1.723-.426-3.53-1.377-4.957Zm.366 15.56c-.69.801-1.455 1.545-2.28 2.229C17.466 21.718 20.67 22.5 24 22.5v-3c-2.556 0-4.935-.51-7.01-1.397Z"
      />
    </svg>
  );
}

export function Layout() {
  const globalState = React.useContext(GlobalStateContext);
  const [state, send] = useActor(globalState.service);

  if (!state.context.directoryHandle) {
    return (
      <div
        className="grid place-items-center h-screen p-4"
        style={{ height: "100svh" }}
      >
        <div className="flex flex-col gap-6 items-center">
          <div className="text-center flex flex-col gap-3 items-center">
            <Logo />
            <h1 className="font-medium text-3xl leading-none lowercase">
              Lumen
            </h1>
            <p className="text-text-muted text-base">
              A tool for thinking, writing,
              <br />
              learning &amp; mindfulness
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => send("SHOW_DIRECTORY_PICKER")}
          >
            Connect a local folder
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {state.matches("prompt") ? (
        <dialog open>
          <Button onClick={() => send("REQUEST_PERMISSION")}>Grant</Button>
        </dialog>
      ) : null}
      <div className="p-4 flex justify-between items-center border-b border-border-divider h-[56px]">
        <div>{state.context.directoryHandle?.name}</div>
        <div className="flex gap-2">
          <Button
            onClick={() => send("RELOAD")}
            disabled={state.matches("loadingNotes")}
          >
            {state.matches("loadingNotes") ? "Loading..." : "Reload"}
          </Button>
          <Button onClick={() => send("DISCONNECT")}>Disconnect</Button>
        </div>
      </div>
      <Outlet />
    </div>
  );
}