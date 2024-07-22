import React from "react";

import { auth, signIn, signOut } from "../../app/auth";
import Link from "next/link";
import { Button } from "./button";
import Image from "next/image";

type Props = {};

function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}>
      <Button type="submit">Sign out</Button>
    </form>
  );
}

const Header = async (props: Props) => {
  const session = await auth();
  console.log(session);

  return (
    <header>
      <nav>
        <div>
          <h1>Formify - AI form Builder</h1>
          <div>
            {session?.user ? (
              <div>session.user.name</div>
            ) : (
              <Link href="/api/auth/signin">
                <Button>Sign in</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
