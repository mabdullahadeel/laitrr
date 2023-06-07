"use client"

import { useEffect } from "react"
import { useParams, usePathname, useSearchParams } from "next/navigation"

export default function Page() {
  const params = useSearchParams()

  useEffect(() => {
    console.log("params", params.get("code"))

    fetch("http://localhost:8000/dj-rest-auth/google/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: params.get("code"),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("res", res)
      })
      .catch((err) => {
        console.log("err", err)
      })
  }, [])

  return <div>Hello</div>
}
