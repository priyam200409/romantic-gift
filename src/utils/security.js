const characters =
  "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"


export function generatePrivateKey(
  length = 12
) {

  let result = ""


  const values =
    new Uint32Array(length)


  crypto.getRandomValues(values)


  for (let i = 0; i < length; i++) {

    result +=
      characters[
        values[i] %
        characters.length
      ]

  }


  return result

}