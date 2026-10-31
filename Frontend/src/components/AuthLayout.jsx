import React from "react";
import Logo from "./Logo";

const AuthLayout = ({ title, description, children, footer }) => (
  <div className="min-h-screen bg-white lg:grid lg:grid-cols-2">
    <aside className="relative hidden overflow-hidden lg:block">
      <img
        src="/images/Burger/Burger1.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/10" />
      <div className="relative flex h-full flex-col justify-between p-10">
        <Logo />
        <div className="max-w-md text-white">
          <p className="font-display text-[40px] font-semibold leading-[1.08] tracking-tight">
            Hot food from the restaurants around you.
          </p>
          <p className="mt-4 text-[17px] leading-relaxed text-white/75">
            Biryani, dosa, pizza and more, tracked from the kitchen to your door.
          </p>
        </div>
      </div>
    </aside>

    <main className="flex min-h-screen flex-col px-4 py-6 sm:px-10">
      <div className="lg:hidden">
        <Logo />
      </div>
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
        <h1 className="font-display text-[32px] font-semibold leading-tight tracking-tight text-ink">
          {title}
        </h1>
        {description && <p className="mt-2 text-[15px] leading-relaxed text-muted">{description}</p>}
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-8 text-[15px] text-muted">{footer}</div>}
      </div>
    </main>
  </div>
);

export default AuthLayout;
