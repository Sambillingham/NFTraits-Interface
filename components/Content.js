const Content = ({ title, subtitle, desc, list, link }) => {
  return (
    <article className="border-2 border-slate-800 bg-slate-50 px-4 py-4 shadow-solid shadow-slate-800">
      <h1 className="text-3xl font-bold ">{title}</h1>
      <h2 className="mb-2 text-xl font-bold">&middot; {subtitle}</h2>
      <p className="mb-4 text-base">{desc}</p>
      <ul className="mb-8">
        {list.map((x) => (
          <li key={x}>&middot; {x}</li>
        ))}
      </ul>
      <a
        className="block w-full bg-slate-800 px-8 py-4 text-center uppercase text-white shadow-solid shadow-slate-400"
        href={link.to}
      >
        {link.text}
      </a>
    </article>
  );
};

export default Content;
