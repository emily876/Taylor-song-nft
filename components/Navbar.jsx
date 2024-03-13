"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";

const Navbar = () => {
  const wallet = Cookies.get("tarot_wallet");

  const [hovered, setHovered] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  const logout = {
    color: hovered ? "red" : "black",
  };

  const getAptosWallet = () => {
    if ("aptos" in window) {
      return window.aptos;
    } else {
      window.open("https://petra.app/", "_blank");
    }
  };

  const connectWallet = async () => {
   
    try {
      const networkwallet = await window.aptos.network();

      // Check if the connected network is Mainnet
      if (networkwallet === "Testnet") {

        const wallet = getAptosWallet();
        const response = await wallet.connect();

        const account = await wallet.account();
        console.log("account", account);
        Cookies.set("tarot_wallet", account.address, { expires: 7 });
        window.location.reload();
      } else {
        alert(`Switch to Testnet in your wallet`);
      }
    } catch (err) {
      console.log(err, err.message);
    }
  };

  const handleDeleteCookie = () => {
    Cookies.remove("tarot_wallet");
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getRandomNumber = () => Math.floor(Math.random() * 1000);
        const apiUrl = `https://api.multiavatar.com/${getRandomNumber()}`;

        const response = await axios.get(apiUrl);
        const svgDataUri = `data:image/svg+xml,${encodeURIComponent(response.data)}`;
        setAvatarUrl(svgDataUri);
      } catch (error) {
        console.error('Error fetching avatar:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {wallet ? (
          <div className="flex gap-4">
          <Link href="/profile">{avatarUrl && <img src={avatarUrl} alt="Avatar" style={{width: 45}}/>} </Link>
          <div>
          <div className="ltext-black rounded-lg text-lg font-bold text-center">
            {wallet.slice(0, 4)}...{wallet.slice(-4)}
          </div>
          <button
            onClick={handleDeleteCookie}
            style={logout}
            className="mx-auto hover:text-red-400 text-black text-lg font-bold"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            Logout
          </button>
          </div>
          </div>
      ) : (
        <>
        <button onClick={connectWallet}>Connect wallet</button>
        <button onClick={wallet.disconnect()}>disconnect</button>
        </>
      )}
    </div>
  );
};

export default Navbar;
