const HERO_IMAGE =
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=flat%20vector%20illustration%20of%20diverse%20people%20sharing%20photos%20and%20comments%20on%20social%20media%20through%20smartphones%2C%20indigo%20and%20purple%20gradient%20background%2C%20clean%20minimal%20modern%20design&image_size=landscape_4_3'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen items-start justify-center bg-slate-100 p-3 sm:items-center sm:p-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid-cols-2">
        <aside className="hidden flex-col justify-between bg-indigo-600 p-8 text-white md:flex">
          <div>
            <p className="text-2xl font-bold">Route Posts</p>
            <p className="mt-2 text-sm text-indigo-100">
              Connect with friends and the world around you.
            </p>
          </div>

          <img
            src={HERO_IMAGE}
            alt="People sharing posts on Route Posts"
            className="my-6 w-full rounded-2xl object-cover"
          />

          <p className="text-xs text-indigo-200">Route Academy · Social Posts Project</p>
        </aside>

        <section className="p-5 sm:p-8 lg:p-10">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}

          <div className="mt-6">{children}</div>

          {footer && <div className="mt-6 text-sm text-slate-500">{footer}</div>}
        </section>
      </div>
    </div>
  )
}
