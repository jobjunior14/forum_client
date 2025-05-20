/* eslint-disable @typescript-eslint/no-unused-vars */
import { SetStateAction } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader2 } from "lucide-react";

interface SearchBarProps {
  toggleAuthDialog: boolean;
  setToggleAuthDialog: React.Dispatch<SetStateAction<boolean>>;
}

interface Errors {
  username?: string;
  email?: string;
  password?: string;
  serverError?: string;
}

export default function AuthDialog({
  toggleAuthDialog,
  setToggleAuthDialog,
}: SearchBarProps) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [otp, setOtp] = useState<string>("");
  const [activeTab, setActiveTab] = useState({
    new: user?.email ? "account" : "sign-up",
    old: "",
  });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoding] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username.trim()) newErrors.username = "Nom requis";
    if (!formData.email.trim()) newErrors.email = "Email requis";
    if (!formData.password.trim()) newErrors.password = "Mot de passe requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitSignUp = async () => {
    if (validate()) {
      try {
        setIsLoding(true);
        const response = await axios.post(
          `http://localhost:8081/api/auth/register`,
          { ...formData },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setIsLoding(false);
          setActiveTab((prev) => ({ new: "otp", old: "sign-up" }));
        }
      } catch (error) {
        setIsLoding(false);
        setErrors({ serverError: "Erreur lors du chargement" });
        toast.error("Une erreur est survenue");
      } finally {
        setIsLoding(false);
      }
    }
  };

  const handleSubmitSignIn = async () => {
    try {
      setIsLoding(true);
      const response = await axios.post(
        `http://localhost:8081/api/auth/login`,
        { ...formData },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        localStorage.setItem("jwt", response.data);
        setIsLoding(false);
        toast.success("Connexion réussie");
        setToggleAuthDialog(false);
      }
    } catch (error) {
      setIsLoding(false);
      setErrors({ serverError: "Erreur lors du chargement" });
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoding(false);
    }
  };

  const handleSubmitConfirmation = async () => {
    if (otp.length === 6) {
      try {
        setIsLoding(true);
        const response = await axios.post(
          `http://localhost:8081/api/auth/verify-otp?email=${formData.email}&otp=${otp}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setIsLoding(false);
          setActiveTab({ new: "sign-in", old: "" });

          setOtp("");
          setFormData({
            username: "",
            email: "",
            password: "",
          });
          setErrors({});
        }
      } catch (error) {
        setIsLoding(false);
        setErrors({ serverError: "Erreur lors du chargement" });
        toast.error("Une erreur est survenue");
      } finally {
        setIsLoding(false);
      }
    }
  };

  const handleDeconnexion = () => {
    localStorage.removeItem("jwt");
    setActiveTab({ new: "sign-in", old: "" });
  };

  return (
    <div
      className={`w-screen h-screen ${
        toggleAuthDialog ? "" : "scale-0"
      } transition-all bg-[rgba(0,0,0,0.5)] z-20  fixed inset-0 -top-0 pt-0 flex flex-col justify-center items-center  `}
      onClick={() => setToggleAuthDialog(false)}
    >
      <form
        className="absolute top-0  bg-white min-h-[60vh] flex flex-col items-center justify-center w-full sm:max-w-[600px] overflow-hidden px-6 sm:p-10 sm:rounded-2xl pb-4 pt-4 mt-[15vh]  "
        onClick={(e) => e.stopPropagation()}
      >
        {!user?.id && !localStorage.getItem("jwt") && (
          <div className="w-full justify-between flex absolute top-4 px-6  z-40 sm:px-10 gap-6 bg-white  ">
            <button
              type="button"
              onClick={() => setActiveTab({ ...activeTab, new: "sign-up" })}
              className={`w-full border ${
                activeTab.new === "sign-up" ? "bg-gray-200" : ""
              } duration-200 hover:cursor-pointer text-gray-900 rounded-xl py-1 px-1 font-PoppinsRegular`}
            >
              S&apos;inscrire
            </button>
            <button
              type="button"
              onClick={() => setActiveTab({ ...activeTab, new: "sign-in" })}
              className={`w-full border ${
                activeTab.new === "sign-in" ? "bg-gray-200" : ""
              } rounded-xl hover:cursor-pointer py-1 px-1 text-gray-900 font-PoppinsRegular `}
            >
              Se connecter
            </button>
          </div>
        )}

        {/* sign-in  */}
        <div
          className={`flex absolute flex-col gap-8  duration-200 transition-all  justify-center items-center w-full px-6 sm:p-10  ${
            activeTab.new === "sign-in" ? "" : "translate-x-[110%]"
          }`}
        >
          <div className="flex w-full flex-col gap-8">
            {/* email  */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className={`font-PoppinsRegular text-sm ${
                  errors?.username ? "text-red-500" : "text-gray-600"
                } pl-[1px] duration-150 `}
              >
                *Email
              </label>

              <input
                type="email"
                onChange={(e) => handleChange(e)}
                id="email"
                name="email"
                className=" outline-none border-gray-300 border pl-4 rounded-xl py-1 font-PoppinsRegular text-base text-gray-900"
              />
            </div>

            {/* password  */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className={`font-PoppinsRegular text-sm ${
                  errors?.password ? "text-red-500" : "text-gray-600"
                } pl-[1px] duration-150 `}
              >
                *Mot de passe
              </label>

              <input
                type="password"
                onChange={(e) => handleChange(e)}
                id="password"
                name="password"
                className=" outline-none border-gray-300 border pl-4 rounded-xl py-1 font-PoppinsRegular text-base text-gray-900"
              />
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleSubmitSignIn()}
              className="w-full bg-gray-900 text-white flex gap-2 items-center justify-center py-2 rounded-4xl font-PoppinsMedium hover:opacity-75 cursor-pointer duration-200"
            >
              {isLoading && <Loader2 className=" animate-spin" />}
              Se connecter
            </button>
          </div>
        </div>

        {/* sign-up  */}
        <div
          className={`flex  flex-col  absolute gap-8 duration-200 transition-all   w-full  px-6 sm:p-10 ${
            activeTab.new === "sign-up" ? "" : "-translate-x-[110%]"
          }`}
        >
          <ScrollArea className="flex py-8 mt-8  flex-col gap-6">
            <div className="flex flex-col gap-6">
              {/* username  */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="username"
                  className={`font-PoppinsRegular text-sm ${
                    errors?.username ? "text-red-500" : "text-gray-600"
                  } pl-[1px] duration-150 `}
                >
                  *Nom complet
                </label>

                <input
                  type="text"
                  onChange={(e) => handleChange(e)}
                  id="username"
                  name="username"
                  className=" outline-none border-gray-300 border pl-4 rounded-xl py-1 font-PoppinsRegular text-base text-gray-900"
                />
              </div>

              {/* email  */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className={`font-PoppinsRegular text-sm ${
                    errors?.username ? "text-red-500" : "text-gray-600"
                  } pl-[1px] duration-150 `}
                >
                  *Email
                </label>

                <input
                  type="email"
                  onChange={(e) => handleChange(e)}
                  id="email"
                  name="email"
                  className=" outline-none border-gray-300 border pl-4 rounded-xl py-1 font-PoppinsRegular text-base text-gray-900"
                />
              </div>

              {/* civility  */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="password"
                  className={`font-PoppinsRegular text-sm ${
                    errors?.username ? "text-red-500" : "text-gray-600"
                  } pl-[1px] duration-150 `}
                >
                  *Mot de passe
                </label>

                <input
                  type="password"
                  onChange={(e) => handleChange(e)}
                  id="password"
                  name="password"
                  className=" outline-none border-gray-300 border pl-4 rounded-xl py-1 font-PoppinsRegular text-base text-gray-900"
                />
              </div>
            </div>
          </ScrollArea>
          <button
            type="button"
            onClick={() => handleSubmitSignUp()}
            disabled={isLoading}
            className="w-full bg-gray-900 text-white flex items-center justify-center gap-2 py-2 rounded-4xl font-PoppinsMedium hover:opacity-75 cursor-pointer duration-200"
          >
            {isLoading && <Loader2 className=" animate-spin" />}
            S&apos;inscrire
          </button>
          {errors && (
            <p className="text-sm font-PopinsLight text-red-500 text-center -mt-5">
              {errors.serverError
                ? errors.serverError
                : errors.username || errors.email || errors.password
                ? "Veillez remplir tous les champs"
                : ""}
            </p>
          )}
        </div>

        {/* otp config=rmation  */}

        <div
          className={`flex absolute flex-col gap-8  duration-200 transition-all  justify-center items-center w-full px-6 sm:p-10  ${
            activeTab.new === "otp" ? "" : "translate-x-[110%]"
          }`}
        >
          <div className="flex flex-col gap-8">
            <div className="flex gap-2  w-full">
              <InputOTP onChange={setOtp} maxLength={6}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleSubmitConfirmation()}
                className="w-full bg-gray-900 text-white py-2 flex items-center justify-center gap-2 rounded-4xl font-PoppinsMedium hover:opacity-75 cursor-pointer duration-200"
              >
                {isLoading && <Loader2 className=" animate-spin" />}
                Confirmer
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() =>
                  setActiveTab({ ...activeTab, new: activeTab.old })
                }
                className="w-full text-gray-900 font-PoppinsMedium hover:cursor-pointer hover:opacity-75 duration-200"
              >
                Retour
              </button>

              {errors.serverError && (
                <p className="font-PopinsLight text-red-500">
                  {" "}
                  Ouups! Veillez réesayé
                </p>
              )}
            </div>
          </div>
        </div>

        {/* account  */}
        <div
          className={`flex absolute flex-col gap-8  duration-200 transition-all  justify-center items-center w-full px-6 sm:p-10  ${
            activeTab.new === "account" ? "" : "translate-x-[110%]"
          }`}
        >
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2 w-full">
              <p>Des trucs a afficher</p>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleDeconnexion}
                className="w-full bg-gray-900 text-white py-2 flex items-center justify-center gap-2 rounded-4xl font-PoppinsMedium hover:opacity-75 cursor-pointer duration-200"
              >
                {isLoading && <Loader2 className=" animate-spin" />}
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
