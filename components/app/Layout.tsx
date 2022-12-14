import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { signOut } from "next-auth/react";
import Loader from "./Loader";
import useRequireAuth from "../../lib/useRequireAuth";

import type { WithChildren } from "@/types";

interface LayoutProps extends WithChildren {
  siteId?: string;
}

export default function Layout({ siteId, children }: LayoutProps) {
  const title = "Platforms on Vercel by Ade inspired by NextJs";
  const description =
    "Create a fullstack application with multi-tenancy and custom domains support using Next.js, Prisma, and PostgreSQL";
  const logo = "/favicon.ico";
  const router = useRouter();
  const sitePage = router.pathname.startsWith("/app/site/[id]");
  const postPage = router.pathname.startsWith("/app/post/[id]");
  const rootPage = !sitePage && !postPage;
  const tab = rootPage
    ? router.asPath.split("/")[1]
    : router.asPath.split("/")[3];

  const session = useRequireAuth();
  if (!session) return <Loader />;

  return (
    <>
      <div>
        <Head>
          <title>{title}</title>
          <link rel="icon" href={logo} />
          <link rel="shortcut icon" type="image/x-icon" href={logo} />
          <link rel="apple-touch-icon" sizes="180x180" href={logo} />
          <meta name="theme-color" content="#7b46f6" />

          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <meta itemProp="name" content={title} />
          <meta itemProp="description" content={description} />
          <meta itemProp="image" content={logo} />
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={logo} />
          <meta property="og:type" content="website" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@Vercel" />
          <meta name="twitter:creator" content="@addegbenga" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={logo} />
        </Head>
        <div className="absolute left-0 right-0 h-16 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-full max-w-screen-xl px-10 mx-auto sm:px-20">
            <div className="flex space-x-4">
              <Link href="/">
                <a className="flex items-center justify-center">
                  {session.user && session.user.image && (
                    <div className="inline-block w-8 h-8 overflow-hidden align-middle rounded-full">
                      <Image
                        src={session.user.image}
                        width={40}
                        height={40}
                        alt={session.user.name ?? "User avatar"}
                      />
                    </div>
                  )}
                  <span className="inline-block ml-3 font-medium truncate sm:block">
                    {session.user?.name}
                  </span>
                </a>
              </Link>
              <div className="h-8 border border-gray-300" />
              <button
                className="text-gray-500 transition-all duration-150 ease-in-out hover:text-gray-700"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        {rootPage && (
          <div className="absolute left-0 right-0 flex items-center justify-center space-x-16 bg-white border-b border-gray-200 top-16 font-cal">
            <Link href="/" passHref>
              <a
                className={`border-b-2 ${
                  tab == "" ? "border-black" : "border-transparent"
                } py-3`}
              >
                My Sites
              </a>
            </Link>
            <Link href="/settings" passHref>
              <a
                className={`border-b-2 ${
                  tab == "settings" ? "border-black" : "border-transparent"
                } py-3`}
              >
                Settings
              </a>
            </Link>
          </div>
        )}
        {sitePage && (
          <div className="absolute left-0 right-0 bg-white border-b border-gray-200 top-16 font-cal">
            <div className="flex items-center justify-between max-w-screen-xl px-10 mx-auto space-x-16 sm:px-20">
              <Link href="/" passHref>
                <a>
                  ???<p className="hidden ml-3 md:inline-block">All Sites</p>
                </a>
              </Link>
              <div className="flex items-center justify-between space-x-10 md:space-x-16">
                <Link href={`/site/${router.query.id}`} passHref>
                  <a
                    className={`border-b-2 ${
                      !tab ? "border-black" : "border-transparent"
                    } py-3`}
                  >
                    Posts
                  </a>
                </Link>
                <Link href={`/site/${router.query.id}/drafts`} passHref>
                  <a
                    className={`border-b-2 ${
                      tab == "drafts" ? "border-black" : "border-transparent"
                    } py-3`}
                  >
                    Drafts
                  </a>
                </Link>
                <Link href={`/site/${router.query.id}/settings`} passHref>
                  <a
                    className={`border-b-2 ${
                      tab == "settings" ? "border-black" : "border-transparent"
                    } py-3`}
                  >
                    Settings
                  </a>
                </Link>
              </div>
              <div />
            </div>
          </div>
        )}
        {postPage && (
          <div className="absolute left-0 right-0 bg-white border-b border-gray-200 top-16 font-cal">
            <div className="flex items-center justify-between max-w-screen-xl px-10 mx-auto space-x-16 sm:px-20">
              {siteId ? (
                <Link href={`/site/${siteId}`} passHref>
                  <a>
                    ???<p className="hidden ml-3 md:inline-block">All Posts</p>
                  </a>
                </Link>
              ) : (
                <div>
                  {" "}
                  ???<p className="hidden ml-3 md:inline-block">All Posts</p>
                </div>
              )}

              <div className="flex items-center justify-between space-x-10 md:space-x-16">
                <Link href={`/post/${router.query.id}`} passHref>
                  <a
                    className={`border-b-2 ${
                      !tab ? "border-black" : "border-transparent"
                    } py-3`}
                  >
                    Editor
                  </a>
                </Link>
                <Link href={`/post/${router.query.id}/settings`} passHref>
                  <a
                    className={`border-b-2 ${
                      tab == "settings" ? "border-black" : "border-transparent"
                    } py-3`}
                  >
                    Settings
                  </a>
                </Link>
              </div>
              <div />
            </div>
          </div>
        )}
        <div className="pt-28">{children}</div>
      </div>
    </>
  );
}
