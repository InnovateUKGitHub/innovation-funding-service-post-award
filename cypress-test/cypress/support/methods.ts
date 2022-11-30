
const replaceTitleTemplateWithArg = <T>(title: string, args: any): string =>  
/(.*)(\$\d+)(\.*)/.test(title) ? replaceTitleTemplateWithArg(
    title.replace(/(.*)(\$\d+)(\.*)/, function(m, p1, p2, p3) {
      const index = parseInt(p2.replace("$", ""))
      const interpolation = Array.isArray(args) ?args[index] : args
      return `${p1}${interpolation}${p3}`
     }), args) : title

export const testEach= <T>(testArray: T[] ) => (title: string, fn: (args: T) => void) => {
    testArray.forEach(element => {
        it(replaceTitleTemplateWithArg(title, element), () => fn(element))
    }) 
}