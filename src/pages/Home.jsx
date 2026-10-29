import { useEffect, useState } from 'react'

import { createPost, getPosts } from '@/api/posts.api'
import Alert from '@/components/Alert'
import PostCard from '@/components/PostCard'
import PostForm from '@/components/PostForm'
import Spinner from '@/components/Spinner'
import { useAuth } from '@/context/AuthContext'
import { getErrorMessage } from '@/utils/errors'

const PAGE_LIMIT = 5

export default function Home() {
  const { user } = useAuth()

  const [posts, setPosts] = useState([])
  const [pagination, setPagination] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    getPosts({ page: 1, limit: PAGE_LIMIT })
      .then((res) => {
        if (!isActive) return
        setPosts(res.data.posts)
        setPagination(res.meta.pagination)
      })
      .catch((err) => {
        if (isActive) setError(getErrorMessage(err))
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [])

  const handleLoadMore = async () => {
    if (!pagination?.nextPage) return

    setError('')
    setIsLoadingMore(true)
    try {
      const res = await getPosts({ page: pagination.nextPage, limit: PAGE_LIMIT })
      setPosts((prev) => [...prev, ...res.data.posts])
      setPagination(res.meta.pagination)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoadingMore(false)
    }
  }

  // POST /posts
  const handleCreatePost = async (formData) => {
    const res = await createPost(formData)
    const created = res.data.post

    setPosts((prev) => [
      { ...created, user, commentsCount: 0, likesCount: 0, bookmarked: false },
      ...prev,
    ])
    setPagination((prev) => (prev ? { ...prev, total: prev.total + 1 } : prev))
  }

  const handlePostUpdated = (updated) => {
    setPosts((prev) => prev.map((post) => (post._id === updated._id ? { ...post, ...updated } : post)))
  }

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((post) => post._id !== postId))
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Create a post</h2>
        <PostForm submitLabel="Post" onSubmit={handleCreatePost} />
      </section>

      {error && <Alert>{error}</Alert>}

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner className="size-8" />
        </div>
      ) : posts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No posts yet. Be the first to post!
        </p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onPostUpdated={handlePostUpdated}
              onPostDeleted={handlePostDeleted}
            />
          ))}
        </div>
      )}

      {pagination?.nextPage && (
        <div className="flex justify-center pb-4">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            {isLoadingMore && <Spinner className="size-4" />}
            Load more
          </button>
        </div>
      )}
    </div>
  )
}
