const DEFAULT_AVATAR =
  'https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png'

export default function Avatar({ src, alt = 'user', className = 'size-10' }) {
  return (
    <img
      src={src || DEFAULT_AVATAR}
      alt={alt}
      loading="lazy"
      onError={(event) => {
        event.currentTarget.src = DEFAULT_AVATAR
      }}
      className={`rounded-full object-cover ring-1 ring-slate-200 ${className}`}
    />
  )
}
