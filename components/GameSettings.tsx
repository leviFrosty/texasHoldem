import {
  NumberInput,
  Stack,
  Drawer,
  Divider,
  Text,
  Button,
  Popover,
  ActionIcon,
  Group,
} from "@mantine/core";
import {
  defaultBidMultiplier,
  defaultMatchTime,
  defaultRoundExponent,
  defaultRounds,
  defaultStartingBid,
  GameSettings,
  UserSettings,
} from "../pages";
import {
  IconClock,
  IconCirclePlus,
  IconCoins,
  IconVariable,
  IconInfoCircle,
} from "@tabler/icons-react";

interface Props {
  gameSettings: GameSettings;
  userSettings: UserSettings;
  setGameSettings: (
    val: GameSettings | ((prevState: GameSettings) => GameSettings)
  ) => void;
  setUserSettings: (
    val: UserSettings | ((prevState: UserSettings) => UserSettings)
  ) => void;
  handleChangeSettingsDrawerState: (val: boolean) => void;
}

export default function Settings({
  gameSettings,
  userSettings,
  setGameSettings,
  handleChangeSettingsDrawerState,
  setUserSettings,
}: Props) {
  const handleSettingsDrawerClose = () => {
    handleChangeSettingsDrawerState(false);
    if (!userSettings.hasCompletedTutorial) {
      setUserSettings((prevState) => {
        return {
          ...prevState,
          hasCompletedTutorial: true,
        };
      });
    }
  };

  return (
    <>
      <Drawer
        opened={userSettings.isChangingSettings}
        onClose={() => handleSettingsDrawerClose()}
        title="Settings"
        padding="xl"
        size="xl"
      >
        <Stack>
          <NumberInput
            icon={<IconClock />}
            value={gameSettings.matchTime}
            onChange={(val) =>
              setGameSettings((prevState) => {
                const oldDateObj = new Date();
                return {
                  ...prevState,
                  matchTime: val ?? defaultMatchTime,
                  finishTime: new Date(
                    oldDateObj.getTime() +
                      (val ? val : prevState.matchTime) * 60000
                  ),
                };
              })
            }
            min={1}
            max={1000}
            label="Match Time"
            description="Time in minutes"
            withAsterisk
          />
          <NumberInput
            icon={<IconCirclePlus />}
            value={gameSettings.rounds}
            onChange={(val) =>
              setGameSettings((prevState) => {
                return {
                  ...prevState,
                  rounds: val ?? defaultRounds,
                };
              })
            }
            label="Rounds"
            description="Bid rounds. Bids will increase by multiplier after each round."
            withAsterisk
            min={1}
          />
          <NumberInput
            icon={<IconCoins />}
            value={gameSettings.startingBid}
            onChange={(val) =>
              setGameSettings((prevState) => {
                return {
                  ...prevState,
                  startingBid: val ?? defaultStartingBid,
                };
              })
            }
            label="Starting Bid"
            description={`Large bid is ${gameSettings.bidMultiplier}x the small bid.`}
            withAsterisk
            min={1}
          />
          <Divider my="xs" />
          <NumberInput
            icon={<IconVariable />}
            value={gameSettings.bidMultiplier}
            onChange={(val) =>
              setGameSettings((prevState) => {
                return {
                  ...prevState,
                  bidMultiplier: val ?? defaultBidMultiplier,
                };
              })
            }
            label="Bid Multiplier"
            description={`The relation of large bid to small bid. This value will by multiplied by the small bid.`}
            withAsterisk
            min={2}
          />
          <NumberInput
            icon={<IconVariable />}
            value={gameSettings.roundExponent}
            onChange={(val) =>
              setGameSettings((prevState) => {
                return {
                  ...prevState,
                  roundExponent: val ?? defaultRoundExponent,
                };
              })
            }
            label="Round exponentiation"
            description={
              <Group sx={{ gap: "0px" }}>
                <Text>
                  Exponentiates bid amount each round. Recommended value: 1.
                </Text>
                <Popover width={200}>
                  <Popover.Target>
                    <ActionIcon color="blue">
                      <IconInfoCircle size={12} />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Text>
                      This setting forces more expensive bids at later rounds.
                      Increase amount by 0.2+ in addition to increasing the
                      number of rounds in your game (10+) for a more forced
                      ending.
                    </Text>
                  </Popover.Dropdown>
                </Popover>
              </Group>
            }
            precision={1}
            step={0.1}
            withAsterisk
            min={1}
          />
          {/* TODO: add round multiplier which will be used to multiply bids across rounds instead of in relation to one another */}
          <Stack sx={{ gap: "0px" }}>
            <Divider my="xs" />
            <Text size="xs">
              Changing game settings will automatically restart your current
              game if running.
            </Text>
          </Stack>
          <Button onClick={() => handleSettingsDrawerClose()}>
            Close Settings
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}
