import Image from "next/image";

export default function GameImage(props: { imageId: string }) {
  const { imageId } = props;
  const format = "t_720p";
  return (
    <Image
      src={`https://images.igdb.com/igdb/image/upload/${format}/${imageId}.jpg`}
      width={300}
      height={400}
      alt="Picture of game cover"
      className="mx-auto mb-12"
    />
  );
}
