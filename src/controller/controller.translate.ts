import googleTranslateApi from 'google-translate-api'

export async function cnToEn (cn: string) : Promise<any> {
  const result = await googleTranslateApi(cn, {
    to: 'en'
  })
  return result
}

export async function enToCn (en: string) : Promise<any> {

}
