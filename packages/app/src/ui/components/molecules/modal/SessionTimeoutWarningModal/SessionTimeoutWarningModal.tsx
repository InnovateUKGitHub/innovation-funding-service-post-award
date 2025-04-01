import { LogoutReason } from "@framework/constants/enums";
import { Logger } from "@innovateuk/logger";
import { Button } from "@ui/components/atoms/Button/Button";
import { H2 } from "@ui/components/atoms/Heading/Heading.variants";
import { Modal } from "@ui/components/atoms/Modal/Modal";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { useDebounce } from "@ui/components/input-utils";
import { useContent } from "@ui/hooks/content.hook";
import { useSessionTimeout } from "@ui/hooks/useHeartbeat";
import { useEffect, useState } from "react";

const logger = new Logger("Session Timeout Subsystem");

const SessionTimeoutWarningModal = () => {
  const { getContent } = useContent();
  const [timeTillTimeout, setTimeTillTimeout] = useState<number>(Number.MAX_SAFE_INTEGER);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { getTimeout, extendTimeout, timeoutMillis, warningMillis } = useSessionTimeout();

  useEffect(() => {
    let checkTimer: ReturnType<typeof setInterval> | undefined;
    let logTimer: ReturnType<typeof setInterval> | undefined;

    if (Number.isFinite(timeoutMillis) && Number.isFinite(warningMillis)) {
      checkTimer = setInterval(() => {
        const { timeTillTimeout } = getTimeout();

        if (timeTillTimeout < warningMillis && timeTillTimeout > -500) {
          setShowModal(true);
          setTimeTillTimeout(timeTillTimeout);
        } else if (timeTillTimeout < 0) {
          logger.debug("Timeout reached, redirecting to '/logout'...");
          const newLoc = new URL("/logout", location.href);
          newLoc.searchParams.set("reason", LogoutReason.SESSION_TIMEOUT);
          location.assign(newLoc);
          clearTimeout(checkTimer);
        } else {
          setShowModal(false);
        }
      }, 500);

      logTimer = setInterval(() => {
        const { timeTillTimeout } = getTimeout();

        logger.debug(getContent(x => x.components.sessionTimeoutWarningModal.log({ timeout: timeTillTimeout })));
      }, 5000);
    }

    return () => {
      clearTimeout(checkTimer);
      clearTimeout(logTimer);
    };
  }, [getTimeout, warningMillis]);

  const sendHeartbeat = useDebounce(
    () => {
      fetch("/heartbeat");
    },
    true,
    5000,
  );

  useEffect(() => {
    extendTimeout();
  }, []);

  useEffect(() => {
    const handleEvent = () => {
      if (!showModal) {
        sendHeartbeat();
        extendTimeout();
      }
    };

    addEventListener("keydown", handleEvent);
    addEventListener("click", handleEvent);
    addEventListener("scrollend", handleEvent);

    return () => {
      removeEventListener("keydown", handleEvent);
      removeEventListener("click", handleEvent);
      removeEventListener("scrollend", handleEvent);
    };
  }, [extendTimeout, sendHeartbeat, showModal]);

  return (
    <Modal isOpen={showModal} setIsOpen={extendTimeout}>
      <H2>{getContent(x => x.components.sessionTimeoutWarningModal.sectionTitle)}</H2>
      <P>{getContent(x => x.components.sessionTimeoutWarningModal.message({ timeout: timeTillTimeout }))}</P>
      <div className="govuk-button-group">
        <Button styling="Primary" onClick={extendTimeout}>
          {getContent(x => x.components.sessionTimeoutWarningModal.continueWorking)}
        </Button>
        <a className="govuk-link" href="/logout">
          {getContent(x => x.components.sessionTimeoutWarningModal.signOut)}
        </a>
      </div>
    </Modal>
  );
};

export { SessionTimeoutWarningModal };
