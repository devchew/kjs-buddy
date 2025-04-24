import { useWakeLock } from '../hooks/useWakeLock.ts';
import { Switch, Group, Alert } from '@mantine/core';
import { TbScreenShare } from 'react-icons/tb';

export const WakeLock = () => {
    const {wakeLockError, wakeLockActive, toggleWakeLock} = useWakeLock();

    return (
        <Group mb="md">
            {wakeLockError && (
                <Alert color="red" variant="light" title="Wake Lock Error" radius="md" mb="xs">
                    {wakeLockError}
                </Alert>
            )}
            <Switch
                checked={wakeLockActive}
                onChange={() => toggleWakeLock()}
                label="Pozostaw ekran aktywny"
                size="md"
                thumbIcon={
                    wakeLockActive ? (
                        <TbScreenShare size={14} stroke="1.5" />
                    ) : (
                        <TbScreenShare size={14} stroke="1.5" color="gray" />
                    )
                }
            />
        </Group>
    )
}
