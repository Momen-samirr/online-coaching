"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { syncUser } from "../lib/actions/user.action";

export const UserSync = () => {
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    const handelSyncUser = async () => {
      if (isLoaded && isSignedIn) {
        try {
          await syncUser();
        } catch (error) {
          console.log("Failed to sync user", error);
        }
      }
    };
    handelSyncUser();
  }, [isLoaded, isSignedIn]);
  return null;
};

export default UserSync;
