import type { FC } from "react";
import { memo, useCallback, useMemo } from "react";
import { Modal } from "../components/Modal";
import { ModalActionButton } from "../components/ModalActionButton";
import type { DebugSettingsName } from "../hooks/useDebugSettings";
import { useDebugSettingsState, useDebugSettingsStateDispatch } from "../hooks/useDebugSettings";
import s from "./DebugSettingsModal.module.css";

const TIMEOUT_UNTIL_PAGE_RELOAD_AFTER_DEBUG_SETTINGS_RESETS_IN_MS = 1000;

interface DebugSettingOptionProps {
  settingsName: DebugSettingsName;
}

const DebugSettingOption = memo(function DebugSettingOption({ settingsName }: DebugSettingOptionProps) {
  const debugSettings = useDebugSettingsState();
  const dispatchDebugSettingsState = useDebugSettingsStateDispatch();

  const changeHandler = () =>
    dispatchDebugSettingsState({
      type: "set-setting",
      name: settingsName,
      value: !debugSettings[settingsName],
    });

  const settingsNameHumanized = useMemo(() => {
    return settingsName
      .replace(/debug/gi, "")
      .replace(/settings/gi, "")
      .replace(/should/gi, "")
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/([a-z])([0-9])/g, "$1 $2")
      .replace(/([0-9])(a-zA-Z)/g, "$1 $2")
      .toLocaleLowerCase();
  }, [settingsName]);

  return (
    <li className={s.SettingsName}>
      <input
        id={settingsName}
        type="checkbox"
        checked={debugSettings[settingsName]}
        className={s.SettingsNameCheckbox}
        onChange={changeHandler}
      />

      <label htmlFor={settingsName} className={s.SettingsNameLabel}>
        {settingsNameHumanized}
      </label>
    </li>
  );
});

interface ActionButtonsProps {
  onResetDebugSettings?: () => void;
  onResetDebugSettingsAndReloadPage?: () => void;
  onClearLocalStorageDataAndReloadPage?: () => void;
}

const ActionButtons: FC<ActionButtonsProps> = ({
  onResetDebugSettings,
  onResetDebugSettingsAndReloadPage,
  onClearLocalStorageDataAndReloadPage,
}) => {
  return (
    <>
      <ModalActionButton onClick={onClearLocalStorageDataAndReloadPage}>
        Clear localStorage data and reload page
      </ModalActionButton>

      <ModalActionButton onClick={onResetDebugSettings}>Reset debug settings to default</ModalActionButton>

      <ModalActionButton isPrimary onClick={onResetDebugSettingsAndReloadPage}>
        Reset debug settings to default and reload page
      </ModalActionButton>
    </>
  );
};

export interface DebugInfoModalProps {
  onHide?: () => void;
}

export const DebugSettingsModal = memo(function DebugSettingsModal({ onHide }: DebugInfoModalProps) {
  const dialogTitle = "Debug settings";

  const debugSettings = useDebugSettingsState();
  const settingsNames = useMemo(() => {
    return Object.keys(debugSettings) as DebugSettingsName[];
  }, [debugSettings]);

  const dispatchDebugSettingsState = useDebugSettingsStateDispatch();

  const handleResetDebugSettings = useCallback(() => {
    dispatchDebugSettingsState({ type: "reset-settings" });
  }, [dispatchDebugSettingsState]);

  const handleResetDebugSettingsAndReloadPage = useCallback(() => {
    handleResetDebugSettings();

    setTimeout(() => {
      window?.location.reload();
    }, TIMEOUT_UNTIL_PAGE_RELOAD_AFTER_DEBUG_SETTINGS_RESETS_IN_MS);
  }, [handleResetDebugSettings]);

  const handleClearLocalStorageDataAndReloadPage = useCallback(() => {
    setTimeout(() => {
      try {
        localStorage.clear();
      } catch (error) {
        console.error("localStorage error", error);
      }

      window?.location.reload();
    }, TIMEOUT_UNTIL_PAGE_RELOAD_AFTER_DEBUG_SETTINGS_RESETS_IN_MS);
  }, []);

  return (
    <Modal
      dialogTitle={dialogTitle}
      onHide={onHide}
      onClickOnBackground={onHide}
      actionButtons={
        <ActionButtons
          onResetDebugSettings={handleResetDebugSettings}
          onResetDebugSettingsAndReloadPage={handleResetDebugSettingsAndReloadPage}
          onClearLocalStorageDataAndReloadPage={handleClearLocalStorageDataAndReloadPage}
        />
      }
    >
      {settingsNames.length && (
        <ul className={s.SettingsNames}>
          {settingsNames.map((settingsName) => {
            return <DebugSettingOption key={settingsName} settingsName={settingsName} />;
          })}
        </ul>
      )}
    </Modal>
  );
});
