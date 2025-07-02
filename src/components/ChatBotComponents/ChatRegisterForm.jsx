import { useState } from "react";
import { useForm } from "react-hook-form";
import { useChat } from "../../context/ChatContext";
import { useDarkMode } from "../../hooks/UseDarkMode";
import { FaPaperPlane } from "react-icons/fa";
import userApi from "../../api/userApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import FormInput from "../UI/FormInput";
import SubmitButton from "../UI/FormSubmitButton";

const ChatRegisterForm = () => {
  const { userData, updateUserData, isRegistered } = useChat();
  const { darkMode, colors } = useDarkMode();
  const [redirecting, setRedirecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      username: userData.username || "",
      email: userData.email || "",
    },
  });

  const formFieldsConfig = [
    {
      id: "username",
      label: "Your username",
      validationRules: {
        required: "Username is required",
        minLength: {
          value: 5,
          message: "Username must be at least 5 characters",
        },
        maxLength: {
          value: 10,
          message: "Username cannot exceed 10 characters",
        },
        validate: async (value) => {
          const exists = await checkFieldExists("username", value);
          return exists
            ? "This username is already taken, please try another one."
            : true;
        },
      },
      transformValue: (value) => value.charAt(0).toUpperCase() + value.slice(1),
    },
    {
      id: "email",
      label: "Your email address",
      type: "email",
      validationRules: {
        required: "Email is required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address",
        },
        validate: async (value) => {
          const exists = await checkFieldExists("email", value);
          return exists
            ? "This email is already registered, please try another one."
            : true;
        },
      },
    },
  ];

  const checkFieldExists = async (field, value) => {
    try {
      const response = await userApi.get(`/?${field}=${value}`);
      return response.data.length > 0;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
        return existingUsers.some(user => user[field] === value);
      }
      console.warn(`MockAPI check failed for ${field}:`, error.message);
      return false;
    }
  };

  const onSubmit = async (data, event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setRedirecting(true);

    try {
      try {
        await userApi.post("/", data);
      } catch (error) {
        console.warn("MockAPI unavailable, storing locally:", error.message);
        const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
        const newUser = {
          id: Date.now(),
          username: data.username,
          email: data.email,
          createdAt: new Date().toISOString()
        };
        
        existingUsers.push(newUser);
        localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));
      }
      
      updateUserData(data);
      toast.success("You have registered successfully!", {
        autoClose: 1000,
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
        setRedirecting(false);
      }, 4000);
    }
  };

  return (
    <div className="chatRegisterForm relative w-full">
      {redirecting && (
        <div className="absolute inset-0 z-10 bg-white bg-opacity-70 flex items-center justify-center text-[var(--color-primary)] text-xl font-medium">
          <ClipLoader
            color="var(--color-secondary)"
            size={40}
            aria-label="Redirecting spinner"
          />
        </div>
      )}

      <div
        className={`flex flex-col w-full rounded-bl-3xl rounded-br-3xl h-[480px] max-w-md text-left p-5 px-7 ${colors.chatBodyBg}`}
      >
        <h3 className="mb-2">
          Hello, {isRegistered ? userData.username || "Friend" : "Friend"}!
        </h3>
        <p className="text-base mb-8">
          {isRegistered
            ? "You can update your information below"
            : "Before we get started, please enter your name and email so we can begin chatting:"}
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`w-full rounded-3xl transition-colors ${
            darkMode ? colors.chatbody : "bg-white"
          }`}
        >
          {formFieldsConfig.map((field) => (
            <FormInput
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type}
              register={register}
              errors={errors}
              watch={watch}
              darkMode={darkMode}
              validationRules={field.validationRules}
              transformValue={field.transformValue}
            />
          ))}

          <SubmitButton
            isSubmitting={isSubmitting}
            darkMode={darkMode}
            isRegistered={isRegistered}
          />
        </form>

        <p className="text-xs mt-auto text-center text-[var(--subtle-gray-accent)]">
          Design and Development @ P²
        </p>
      </div>
    </div>
  );
};

export default ChatRegisterForm;
