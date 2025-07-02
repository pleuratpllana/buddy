const FormInput = ({
  id,
  label,
  type = "text",
  register,
  errors,
  watch,
  darkMode,
  validationRules = {},
  transformValue = null,
}) => {
  const inputProps = {
    id,
    ...register(id, {
      ...validationRules,
      ...(transformValue && {
        setValueAs: (value) => transformValue(value),
      }),
    }),
    type,
    className: `peer w-full p-3 rounded-lg border focus:outline-none ${
      errors?.[id]
        ? "border-red-500"
        : darkMode
        ? "border-gray-600"
        : "border-gray-300"
    } ${
      darkMode
        ? "bg-transparent border-white text-white focus:ring-[var(--color-primary)] focus:border-[var(--color-secondary)]"
        : "bg-white shadow text-gray-900 focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)]"
    }`,
  };

  // Apply capitalization on input change without affecting other logic
  const handleChange = (e) => {
    if (transformValue) {
      e.target.value = transformValue(e.target.value);
    }
  };

  return (
    <div className="mb-4 w-full relative">
      <input
        {...inputProps}
        onChange={(e) => {
          handleChange(e);
          inputProps.onChange && inputProps.onChange(e);
        }}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-300 ${
          darkMode ? "text-gray-300" : "text-gray-400 bg-white"
        } ${
          watch?.(id)
            ? "top-0 text-xs bg-white px-2 rounded text-gray-900"
            : "top-1/2 text-sm"
        } transform -translate-y-1/2 font-medium`}
      >
        {label}
      </label>
      {errors?.[id] && (
        <p
          className={`mt-1 text-xs ${
            darkMode ? "text-red-300" : "text-red-500"
          }`}
        >
          {errors[id].message}
        </p>
      )}
    </div>
  );
};

export default FormInput;
