import BreadcrumbsNav from "./breadcrumbs-nav";
import SearchTrigger from "./search-trigger";
import LanguagePicker from "./language-picker";

const ItemEditorToolbar: React.FC = () => {

    return (
       <div className="flex items-center justify-between gap-4">
            <BreadcrumbsNav />
            <div className="flex items-center gap-4">
                <SearchTrigger />
                <LanguagePicker />
            </div>
        </div>
    );
};

export default ItemEditorToolbar;
