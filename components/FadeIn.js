import React from 'react';
import styles from '../styles/Components/FadeIn.module.scss';

const FadeInSection = React.forwardRef((props, ref) => {
  const [isVisible, setVisible] = React.useState(false);

  const domRef = React.useRef();

  React.useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        setVisible(entry.isIntersecting);
      });
    });

    observer.observe(domRef.current);

    return () => observer.unobserve(domRef.current);
  }, []);

  return (
    <div {...props} ref={ref}>
      <div
        className={`${styles.fadeInSection} ${
          isVisible ? styles.isVisible : ''
        }`}
        ref={domRef}
      >
        {props.children}
      </div>
    </div>
  );
});

export default FadeInSection;
