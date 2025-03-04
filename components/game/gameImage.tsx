import Image from "next/image";

export default function GameImage(props: {
  imageId: string;
  className?: string;
}) {
  const { imageId, className } = props;
  const format = "1080p";
  return (
    <Image
      src={`https://images.igdb.com/igdb/image/upload/t_${format}/${imageId}.jpg`}
      width={300}
      height={400}
      alt="Picture of game cover"
      className={className}
    />
  );
}
