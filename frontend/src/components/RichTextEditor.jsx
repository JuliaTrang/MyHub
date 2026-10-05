import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  ['blockquote', 'code-block'],
  ['link'],
  ['clean'],
];

export default function RichTextEditor({ value, onChange, placeholder = 'Write something beautiful...' }) {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  useEffect(() => {
    if (quillRef.current) return; // already initialised

    const quill = new Quill(containerRef.current, {
      theme: 'snow',
      placeholder,
      modules: { toolbar: TOOLBAR },
    });

    quillRef.current = quill;

    // Set initial value
    if (value) {
      quill.root.innerHTML = value;
    }

    quill.on('text-change', () => {
      const html = quill.root.innerHTML;
      // Treat empty editor as empty string
      onChangeRef.current(quill.getText().trim() === '' ? '' : html);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes (e.g. reset form) without causing a loop
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;
    const currentHtml = quill.root.innerHTML;
    if (currentHtml !== value && (value === '' || value === '<p><br></p>')) {
      quill.setText('');
    }
  }, [value]);

  return <div ref={containerRef} />;
}
