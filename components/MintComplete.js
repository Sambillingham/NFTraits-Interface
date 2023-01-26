import Image from 'next/image'

const Loading = ({ batch, resetMint }) => {

  const idToRarity = (x) => {
    if (x % 5 === 0) {
      return 'common'
    } 
    if (x % 5 === 1) {
      return 'uncommon'
    } 
    if (x % 5 === 2) {
      return 'rare'
    } 
    if (x % 5 === 3) {
      return 'Ledgendary'
    } 
    if (x % 5 === 4) {
      return '1/1'
    } 
  }

  const idToClassName = (x) => {
    if (x % 5 === 0) {
      return 'border-teal-500 bg-teal-300'
    } 
    if (x % 5 === 1) {
      return 'border-sky-500 bg-sky-300'
    } 
    if (x % 5 === 2) {
      return 'border-rose-500 bg-rose-300'
    } 
    if (x % 5 === 3) {
      return 'border-yellow-500 bg-yellow-300'
    } 
    if (x % 5 === 4) {
      return 'border-purple-500 bg-purple-300'
    } 
  }

  if(!batch) return null
  return (
    <article className="absolute top-0 left-0 flex h-full w-full bg-slate-700 bg-opacity-60">
      <div className="m-auto flex-row flex-wrap border-2 border-teal-500 bg-teal-50 px-4 py-4 text-teal-500 shadow-solid shadow-teal-500 relative">
      <h2 className="text-3xl font-bold">Trait Batch</h2>
        <div class="flex flex-row">
          {batch.map((x) => (
            <a key={x} href={`https://testnets.opensea.io/assets/goerli/0x0a0BaB951Bc81367376c61caF2476459f9C8e9F9/${x}`}
              target="_blank"
              rel="noreferrer"
              className=" text-center"
              >
              <div className="flex flex-col">
                <div className={`py-8 px-8 mx-2 my-2 border-2 inline-block ${idToClassName(x)}`}>
                </div>
                <h2>#{x}</h2>
                <h2 className=" text-center">{idToRarity(x)}</h2>
              </div>
            </a>
          ))}
        </div>
        <span
        onClick={ () => resetMint(null) }
        className="absolute bg-teal-500 text-white px-2 py-2 top-0 right-0">Close</span>
      </div>
    </article>
  );
};

export default Loading;
