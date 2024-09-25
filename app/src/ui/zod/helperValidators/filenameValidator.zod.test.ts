import { filenameValidatior } from "./filenameValidator.zod";

describe("filenameValidator", () => {
  test.each`
    test                                           | filename                                | valid
    ${"valid photograph"}                          | ${"world.png"}                          | ${true}
    ${"valid document"}                            | ${"tvlicence.pdf"}                      | ${true}
    ${"valid powerpoint presentation"}             | ${"hello.pptx"}                         | ${true}
    ${"valid spreadsheet"}                         | ${"accounting.xlsx"}                    | ${true}
    ${"valid text document"}                       | ${"text.txt"}                           | ${true}
    ${"valid filename with space"}                 | ${"sean lock.xlsx"}                     | ${true}
    ${"valid filename with acute"}                 | ${"Union européenne.txt"}               | ${true}
    ${"valid filename with œ character"}           | ${"J'aime œufs.pptx"}                   | ${true}
    ${"valid filename with ß character"}           | ${"straße.png"}                         | ${true}
    ${"valid ukranian filename"}                   | ${"Барак Обама.pdf"}                    | ${true}
    ${"valid traditional chinese filename"}        | ${"巴拉克 歐巴馬.txt"}                  | ${true}
    ${"valid katakana filename"}                   | ${"バラク オバマ.pptx"}                 | ${true}
    ${"valid burmese filename"}                    | ${"ဘာရက် အိုဘားမား.txt"}                | ${true}
    ${"valid arabic filename"}                     | ${"باراك أوباما .txt"}                  | ${true}
    ${"invalid powerpoint presentation extension"} | ${"hello.ppt"}                          | ${false}
    ${"invalid character in name"}                 | ${"???.txt"}                            | ${false}
    ${"invalid file with extension only"}          | ${".pptx"}                              | ${false}
    ${"invalid file without extension"}            | ${"pptx"}                               | ${false}
    ${"invalid file without name"}                 | ${""}                                   | ${false}
    ${"invalid reserved Microsoft Windows name"}   | ${"CON.pptx"}                           | ${false}
    ${"invalid RTL character in name"}             | ${"\u202Extpp.suriv.a.ton.ylemert.exe"} | ${false}
    ${"invalid file with path"}                    | ${"/mnt/c/whatever.pptx"}               | ${false}
    ${"man in business suit levitating"}           | ${"🕴️.txt"}                             | ${true}
  `("$test", ({ filename, valid }) => {
    const res = filenameValidatior({
      maxFileBasenameLength: 32,
      permittedTypes: {
        imageTypes: ["png"],
        pdfTypes: ["pdf"],
        presentationTypes: ["pptx"],
        spreadsheetTypes: ["xlsx"],
        textTypes: ["txt"],
      },
    }).safeParse(filename);

    expect(res.error).toMatchSnapshot();
    expect(res.success).toBe(valid);
  });
});
