/**
 * Verify if the env variable exists in either Node or Deno.
 * @param {string} variable name
 * @returns {string | undefined}
 */
export const lookupEnvVariable = (variable: string): string | undefined => {
    if (typeof process !== "undefined" && process.env?.[variable]) {
        return process.env[variable]
    }

    // @ts-ignore
    if (typeof Deno !== "undefined" && Deno.env?.get(variable)) {
        // @ts-ignore
        return Deno.env.get(variable)
    }

    return undefined
}

export const debounce = (func, timeout = 500) => {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, timeout)
    }
}