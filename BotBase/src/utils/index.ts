/**
 * Pretty logs a warning message
 * @param title Module name
 * @param outputText Text
 */
 export function PrettyLogWarn(title: string, ...outputText: any[])
 {
     console.log(`Warning; ${title}: ${outputText.reduce((text, next) => { return `${text} ${next}` })}`)
 }
 
 /**
 * Pretty logs a message
 * @param title Module name
 * @param outputText Text
 */
export function PrettyLog(title: string, ...outputText: any[])
{
    console.log(`${title}: ${outputText.reduce((text, next) => { return `${text} ${next}` })}`)
}

/**
 * Pretty logs an error message
 * @param title Module name
 * @param outputText Text
 */
 export function PrettyLogError(title: string, ...outputText: any[])
 {
     console.log(`\n\nError; ${title}: ${outputText.reduce((text, next) => { return `${text} ${next}` })}`)
 }

/**
 * Pretty logs an fatal error message
 * @param title Module name
 * @param outputText Text
 */
 export function PrettyLogFatalError(title: string, ...outputText: any[])
 {
     console.log(`\n\nFATAL ERROR; ${title}: ${outputText.reduce((text, next) => { return `${text} ${next}` })}`)
 }
  
// Work around for string replace
// Source: https://gist.github.com/padolsey/6008842#gistcomment-885154
/**
 * Replace objects in strings
 * 
 * example: if `input` is `"foo {bar}"` with `data` set to `{ bar: "sinas" }` return value will be `"foo sinas"`
 * @param input input string, with objects to be replaced
 * @param data object with data values
 * @returns `input` with template objects replaces with data from `data` property.
 */
export function leafletInterpolater(input: string, data: any) {
    return input.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
        var value = data[key];
        return value;
    });
}

export function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }