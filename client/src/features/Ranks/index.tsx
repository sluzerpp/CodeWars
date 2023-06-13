import { Select } from '@mantine/core';
import { forwardRef, useState } from 'react';
import useGetAllRanks from './hooks/useGetAllRanks';
import Rank from '@/shared/ui/Rank';
import { IRank } from '@/shared/types';
import './index.scss';

interface RanksProps {
  value: string | null;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
  update?: boolean;
}

export default function Ranks({ value, setValue, update }: RanksProps) {
  const [isLoading, ranks] = useGetAllRanks(update);

  return (
    <div>
      {isLoading ? (
        <h2>Загрузка</h2>
      ) : (
        <Select
          placeholder="Выберите сложность"
          maxDropdownHeight={400}
          value={value}
          onChange={setValue}
          data={ranks.map((rank) => ({
            label: `${rank.id}: ${rank.name} ${rank.number} - ${rank.colorName} (${rank.colorHEX}) | from: ${rank.expFrom}, reward: ${rank.expReward}`,
            value: String(rank.id),
          }))}
        />
      )}
    </div>
  );
}
