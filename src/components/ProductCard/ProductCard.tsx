type Props = {
  image: string;
  title: string;
  description: string;
  link: string;
};

const ProductCard = ({ description, title, image, link }: Props) => {
  return (
    <a
      href={link}
      title={title}
      className="card card--product-category col-xs-12 col-lg-6"
    >
      <div className="card__content">
        <figure className="image card__image">
          <img src={image} alt={title} />
        </figure>
        <div className="card__content__body">
          <h4 className="card__title">
            <div className="button link--chevron link--chevron-xl">
              <span>
                <span className="button-label">Awlgrip Topcoat Spray</span>
              </span>
              <span className="postfix-icon">
                <svg className="icon icon-postfix icon--freeform icon--fill icon-chevron-right">
                  <use href="/profiles/gppcoating/themes/custom/awlgrip/assets/toolkit/images/svgsprite/sprite.svg#icon-chevron-right"></use>
                </svg>
              </span>
            </div>
          </h4>
          <p className="card__text">{description}</p>
        </div>
      </div>
    </a>
  );
};

export default ProductCard;
