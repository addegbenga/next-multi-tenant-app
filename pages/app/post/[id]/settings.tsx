import toast, { Toaster } from "react-hot-toast";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import BlurImage from "@/components/BlurImage";
import CloudinaryUploadWidget from "@/components/Cloudinary";
import Layout from "@/components/app/Layout";
import Loader from "@/components/app/Loader";
import LoadingDots from "@/components/app/loading-dots";
import Modal from "@/components/Modal";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";

import type { ChangeEvent } from "react";

import type { WithSitePost } from "@/types";

interface SettingsData {
  slug: string;
  id: string;
  image: string;
  imageBlurhash: string;
}

export default function PostSettings() {
  const router = useRouter();

  // TODO: Undefined check redirects to error
  const { id: postId } = router.query;

  const { data: settings, isValidating } = useSWR<WithSitePost>(
    `/api/post?postId=${postId}`,
    fetcher,
    {
      onError: () => router.push("/"),
      revalidateOnFocus: false,
    }
  );

  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);

  const [data, setData] = useState<SettingsData>({
    image: settings?.image ?? "",
    imageBlurhash: settings?.imageBlurhash ?? "",
    slug: settings?.slug ?? "",
    id: settings?.id ?? "",
  });

  useEffect(() => {
    if (settings)
      setData({
        slug: settings.slug,
        image: settings.image ?? "",
        imageBlurhash: settings.imageBlurhash ?? "",
        id: settings.id,
      });
  }, [settings]);

  async function savePostSettings(data: SettingsData) {
    setSaving(true);

    try {
      const response = await fetch("/api/post", {
        method: HttpMethod.PUT,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: postId,
          slug: data.slug,
          image: data.image,
          imageBlurhash: data.imageBlurhash,
          subdomain: settings?.site?.subdomain,
          customDomain: settings?.site?.customDomain,
        }),
      });

      if (response.ok) toast.success(`Changes Saved`);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  async function deletePost(postId: string) {
    setDeletingPost(true);
    try {
      const response = await fetch(`/api/post?postId=${postId}`, {
        method: HttpMethod.DELETE,
      });

      if (response.ok) {
        router.push(`/site/${settings?.site?.id}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingPost(false);
    }
  }

  if (isValidating)
    return (
      <Layout>
        <Loader />
      </Layout>
    );

  return (
    <>
      <Layout siteId={settings?.site?.id}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 10000,
          }}
        />
        <div className="max-w-screen-xl px-10 mx-auto mt-20 mb-16 sm:px-20">
          <h1 className="mb-12 text-5xl font-cal">Post Settings</h1>
          <div className="flex flex-col space-y-12 mb-28">
            <div className="space-y-6">
              <h2 className="text-2xl font-cal">Post Slug</h2>
              <div className="flex items-center max-w-lg border border-gray-700 rounded-lg">
                <span className="px-5 border-r border-gray-600 rounded-l-lg font-cal whitespace-nowrap">
                  {settings?.site?.subdomain}.startblogging.xyz/
                </span>
                <input
                  className="w-full px-5 py-3 text-gray-700 placeholder-gray-400 bg-white border-none rounded-none rounded-r-lg font-cal focus:outline-none focus:ring-0"
                  type="text"
                  name="slug"
                  placeholder="post-slug"
                  value={data?.slug}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    setData((data) => ({ ...data, slug: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-cal">Thumbnail Image</h2>
              <div
                className={`${
                  data.image ? "" : "animate-pulse bg-gray-300 h-150"
                } relative mt-5 w-full border-2 border-gray-800 border-dashed rounded-md`}
              >
                <CloudinaryUploadWidget
                  callback={(e) =>
                    setData({
                      ...data,
                      image: e.secure_url,
                    })
                  }
                >
                  {({ open }) => (
                    <button
                      onClick={open}
                      className="absolute z-10 flex flex-col items-center justify-center w-full h-full transition-all duration-200 ease-linear bg-gray-200 rounded-md opacity-0 hover:opacity-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100"
                        height="100"
                        viewBox="0 0 24 24"
                      >
                        <path d="M16 16h-3v5h-2v-5h-3l4-4 4 4zm3.479-5.908c-.212-3.951-3.473-7.092-7.479-7.092s-7.267 3.141-7.479 7.092c-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h3.5v-2h-3.5c-1.93 0-3.5-1.57-3.5-3.5 0-2.797 2.479-3.833 4.433-3.72-.167-4.218 2.208-6.78 5.567-6.78 3.453 0 5.891 2.797 5.567 6.78 1.745-.046 4.433.751 4.433 3.72 0 1.93-1.57 3.5-3.5 3.5h-3.5v2h3.5c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408z" />
                      </svg>
                      <p>Upload another image</p>
                    </button>
                  )}
                </CloudinaryUploadWidget>

                {data.image && (
                  <BlurImage
                    src={data.image}
                    alt="Cover Photo"
                    width={800}
                    height={500}
                    layout="responsive"
                    objectFit="cover"
                    placeholder="blur"
                    className="rounded-md"
                    blurDataURL={data.imageBlurhash}
                  />
                )}
              </div>

              <div className="w-full h-10" />
              <div className="flex flex-col max-w-lg space-y-6">
                <h2 className="text-2xl font-cal">Delete Post</h2>
                <p>
                  Permanently delete your post and all of its contents from our
                  platform. This action is not reversible ??? please continue with
                  caution.
                </p>
                <button
                  onClick={() => {
                    setShowDeleteModal(true);
                  }}
                  className="px-5 py-3 text-white transition-all duration-150 ease-in-out bg-red-500 border border-red-500 border-solid rounded-md hover:text-red-500 hover:bg-white max-w-max font-cal focus:outline-none"
                >
                  Delete Post
                </button>
              </div>
            </div>
          </div>
        </div>
        <Modal showModal={showDeleteModal} setShowModal={setShowDeleteModal}>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await deletePost(postId as string);
            }}
            className="inline-block w-full max-w-md pt-8 overflow-hidden text-center align-middle transition-all bg-white rounded-lg shadow-xl"
          >
            <h2 className="mb-6 text-2xl font-cal">Delete Post</h2>
            <div className="grid w-5/6 mx-auto gap-y-5">
              <p className="mb-3 text-gray-600">
                Are you sure you want to delete your post? This action is not
                reversible.
              </p>
            </div>
            <div className="flex items-center justify-between w-full mt-10">
              <button
                type="button"
                className="w-full px-5 py-5 text-sm text-gray-400 transition-all duration-150 ease-in-out border-t border-gray-300 rounded-bl hover:text-black focus:outline-none focus:ring-0"
                onClick={() => setShowDeleteModal(false)}
              >
                CANCEL
              </button>

              <button
                type="submit"
                disabled={deletingPost}
                className={`${
                  deletingPost
                    ? "cursor-not-allowed text-gray-400 bg-gray-50"
                    : "bg-white text-gray-600 hover:text-black"
                } w-full px-5 py-5 text-sm border-t border-l border-gray-300 rounded-br focus:outline-none focus:ring-0 transition-all ease-in-out duration-150`}
              >
                {deletingPost ? <LoadingDots /> : "DELETE POST"}
              </button>
            </div>
          </form>
        </Modal>
        <footer className="fixed inset-x-0 bottom-0 z-20 h-20 bg-white border-t border-gray-500 border-solid">
          <div className="flex items-center justify-end h-full max-w-screen-xl px-10 mx-auto sm:px-20">
            <button
              onClick={() => {
                savePostSettings(data);
              }}
              disabled={saving}
              className={`${
                saving
                  ? "cursor-not-allowed bg-gray-300 border-gray-300"
                  : "bg-black hover:bg-white hover:text-black border-black"
              } mx-2 w-36 h-12 text-lg text-white border-2 focus:outline-none transition-all ease-in-out duration-150`}
            >
              {saving ? <LoadingDots /> : "Save Changes"}
            </button>
          </div>
        </footer>
      </Layout>
    </>
  );
}
