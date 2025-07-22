import AddItemButton from "./add-item-button";
import BreadcrumbsNav from "./breadcrumbs-nav";
import SearchTrigger from "./search-trigger";
import LanguagePicker from "./language-picker";

const ItemEditorToolbar: React.FC = () => {

    return (
       <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <BreadcrumbsNav />
                <AddItemButton size="sm" />
            </div>
            <div className="flex items-center gap-4">
                <SearchTrigger />
                <LanguagePicker />
            </div>
        </div>
    );
};

export default ItemEditorToolbar;
