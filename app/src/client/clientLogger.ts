import { LogLevel } from "@framework/constants/enums";
import { BaseLogger } from "@shared/logger";

export class ClientLogger extends BaseLogger {
  protected log(level: LogLevel, message: string, ...params: unknown[]) {
    let output = "";

    const defaultCSS = "font-family: system-ui;";
    let logLevelCSS = defaultCSS;
    const logIdentifierCSS = defaultCSS;
    const logMessageCSS = defaultCSS;
    let logLevelName: string;

    // Adjust colours and message content for different log levels.
    switch (level) {
      case LogLevel.ERROR:
        logLevelCSS += "color: RED;";
        logLevelName = "Error ⛔";
        break;
      case LogLevel.WARN:
        logLevelCSS += "color: YELLOW;";
        logLevelName = "Warning ⚠";
        break;
      case LogLevel.DEBUG:
        logLevelCSS += "color: BLUE;";
        logLevelName = "Debugging 🐣";
        break;
      case LogLevel.INFO:
        logLevelCSS += "color: BLUE;";
        logLevelName = "Info 📘";
        break;
      case LogLevel.VERBOSE:
        logLevelCSS += "color: BLUE;";
        logLevelName = "Verbose 🐥";
        break;
      case LogLevel.TRACE:
        logLevelCSS += "color: BLUE;";
        logLevelName = "Trace 🐈";
        break;
      default:
        logLevelName = "Default";
        break;
    }

    // Print the log type name, followed by the identifier, followed by the message.
    output += `%c${logLevelName}  %c${this.identifier}%c / %c${message}`;

    // Print the output.
    console.log(output, logLevelCSS, logIdentifierCSS, defaultCSS, logMessageCSS, ...params);
  }
}
