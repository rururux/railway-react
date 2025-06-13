import { authCookie } from "~/.server/cookies"
import type { Route } from "./+types"
import { redirect, useLoaderData, useSubmit } from "react-router"
import { useId, useState, type ChangeEventHandler } from "react"
import { useForm } from "~/hooks/useForm"
import { UserDataSchema, type UserDataSchemaValue } from "~/schemas"
import createRHFErrorData from "~/utils/createRHFErrorData"
import { ZodError } from "zod/v4"
import Compressor from "compressorjs"
import { Header } from "~/components/Header"

export async function loader({ request }: Route.LoaderArgs) {
  const cookies = request.headers.get("Cookie")
  const token = await authCookie.parse(cookies)

  if (token === null) return redirect("/login")

  const userDataResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, {
    headers: { "Authorization": `Bearer ${token}` }
  })

  if (userDataResponse.ok !== true) {
    const userDataResponseData = await userDataResponse.text()

    console.error(userDataResponseData)
    throw new Error()
  }

  const userDataResponseData: { name: string, iconUrl?: string } = await userDataResponse.json()

  return userDataResponseData
}

export async function action({ request }: Route.ActionArgs) {
  try {
    const cookies = request.headers.get("Cookie")
    const token = await authCookie.parse(cookies)

    if (token === null) return redirect("/login")

    const requestFormData = await request.formData()
    const requestData = Array.from(requestFormData.entries()).reduce((prv, cur) => {
      return { ...prv, [cur[0]]: cur[1] }
    }, {} as { [key: string]: unknown })
    const result = UserDataSchema.parse(requestData)
    const requests: Promise<Response>[] = []

    if ("name" in result && result.name !== undefined) {
      requests.push(
        fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, {
          method: "PUT",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify(result.name)
        })
      )
    }

    if ("icon" in result && result.icon !== undefined) {
      const formData = new FormData()

      formData.append("icon", result.icon)
      requests.push(
        fetch(`${import.meta.env.VITE_API_BASE_URL}/uploads`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/xxx" },
          body: formData
        })
      )
    }

    const responses = await Promise.all(requests)

    if (responses.some(res => res.ok !== true)) {
      const firstErrorResponse = responses.find(res => res.ok !== true)
      const firstErrorResponseData = firstErrorResponse?.text()

      console.error(firstErrorResponseData)

      throw new Error("")
    }

    const responseDatas = await Promise.all(responses.map(res => res.json()))
    const responseData = responseDatas.reduce<Record<string, string>>((prv, cur) => ({ ...prv, ...cur }), {})

    return responseData
  } catch(e) {
    if (e instanceof ZodError) {
      return createRHFErrorData(e)
    } else {
      return { errors: [ { root: "unknown server error" } ] }
    }
  }
}

export default function Profile() {
  const loaderData = useLoaderData<typeof loader>()
  const { register, setValue, formState: { isDirty }, handleSubmit } = useForm({ schema: UserDataSchema })
  const _onSubmit = useSubmit()
  const [ iconUrl, setIconUrl ] = useState(loaderData.iconUrl)
  const nameInputId = useId()
  const iconInputId = useId()

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    const files = Array.from(e.currentTarget.files ?? [])
    let blobUrl: string | undefined

    if (files[0]) {
      blobUrl = URL.createObjectURL(files[0])
      setValue("icon", files[0])
    }

    setIconUrl(oldIconUrl => {
      if (oldIconUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(oldIconUrl)
      }

      return blobUrl
    })
  }

  const onSubmit = (data: UserDataSchemaValue) => {
    ;(async () => {
      const compressedFile = await new Promise<Blob | void>(r => data.icon !== undefined? new Compressor(data.icon, { success: r }) : r())
      const formData = Object.entries(data).reduce((prv, cur) => {
        if (cur[0] !== "icon") {
          prv.append(cur[0], cur[1])
        } else if (compressedFile !== undefined) {
          prv.append(cur[0], compressedFile)
        }

        return prv
      }, new FormData())

      _onSubmit(formData, { method: "POST", encType: "multipart/form-data" })
    })()
  }

  return (
    <>
      <Header />
      <main className="grid place-items-center min-h-dvh">
        <form className="w-lg p-4 border-2 border-gray-400 rounded-md grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-1">
            <label htmlFor={nameInputId}>ユーザー名:</label>
            <input id={nameInputId} className="w-2xs px-2 py-1 border-2 border-gray-500 rounded-sm" type="text" {...register("name", { value: loaderData.name })} />
          </div>
          <div className="grid gap-1 grid-cols-[minmax(0,_1fr)_auto] grid-rows-[minmax(0,_1fr)_auto] gap-x-2">
            <label htmlFor={iconInputId}>アイコン:</label>
            <input id={iconInputId} className="row-span-1 row-start-2 file:font-bold file:text-blue-600 file:border-2 file:border-blue-600 file:px-2 file:py-1 file:rounded-sm" name="icon" type="file" onChange={handleChange} />
            <div className="aspect-square w-24 row-start-2">
              {iconUrl === undefined? (
                <div className="size-full bg-gray-300 grid place-items-center">No Image</div>
              ) : (
                <img className="size-full object-cover" src={iconUrl} alt="" />
              )}
            </div>
          </div>
          <button className="mt-4 w-fit px-4 py-2 text-white bg-blue-600 rounded-sm justify-self-end disabled:text-black disabled:bg-gray-400" disabled={!isDirty}>更新</button>
        </form>
      </main>
    </>
  )
}