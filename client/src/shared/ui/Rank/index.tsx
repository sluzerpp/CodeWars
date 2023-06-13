import { IRank } from '@/shared/types';
import './index.scss';

interface RankProps {
  rank: IRank;
}

export default function Rank({ rank }: RankProps) {
  const color = rank.colorHEX[0] === '#' ? rank.colorHEX : `#${rank.colorHEX}`;

  return (
    <>
      <div
        className="rank"
        style={{ borderColor: `${color}`, color: `${color}` }}
        title={rank.colorName}
      >
        {rank.name + ' ' + rank.number}
      </div>
    </>
  );
}
