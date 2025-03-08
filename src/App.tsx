import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";

function FieldInfo({ field }: { field: AnyFieldApi }) {
 return (
  <>
   {field.state.meta.isTouched && field.state.meta.errors.length ? (
    <em>{field.state.meta.errors.join(", ")}</em>
   ) : null}
   {field.state.meta.isValidating ? "Validating..." : null}
  </>
 );
}

function App() {
 const form = useForm({
  defaultValues: {
   firstName: "",
   lastName: "",
  },
  onSubmit: async ({ value }) => {
   // Do something with form data
   console.log(value);
  },
 });

 return (
  <div>
   <h1>シンプルなフォームの例</h1>
   <form
    onSubmit={(e) => {
     e.preventDefault();
     e.stopPropagation();
     form.handleSubmit();
    }}
   >
    <div>
     {/* 型安全なフィールドコンポーネント */}
     <form.Field
      name="firstName"
      validators={{
       onChange: ({ value }) =>
        !value
         ? "名前は必須です"
         : value.length < 3
         ? "名前は3文字以上である必要があります"
         : undefined,
       onChangeAsyncDebounceMs: 500,
       onChangeAsync: async ({ value }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return (
         value.includes("error") && '名前に "error" を含めることはできません'
        );
       },
      }}
      children={(field) => {
       // 拙速な抽象化は避ける。レンダープロップは便利！
       return (
        <>
         <label htmlFor={field.name}>名前（First Name）:</label>
         <input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
         />
         <FieldInfo field={field} />
        </>
       );
      }}
     />
    </div>
    <div>
     <form.Field
      name="lastName"
      children={(field) => (
       <>
        <label htmlFor={field.name}>苗字（Last Name）:</label>
        <input
         id={field.name}
         name={field.name}
         value={field.state.value}
         onBlur={field.handleBlur}
         onChange={(e) => field.handleChange(e.target.value)}
        />
        <FieldInfo field={field} />
       </>
      )}
     />
    </div>
    <form.Subscribe
     selector={(state) => [state.canSubmit, state.isSubmitting]}
     children={([canSubmit, isSubmitting]) => (
      <button type="submit" disabled={!canSubmit}>
       {isSubmitting ? "..." : "送信"}
      </button>
     )}
    />
   </form>
  </div>
 );
}

export default App;
