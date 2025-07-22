import { useSurveyEditor } from "@/components/survey-editor/store/useSurveyEditor";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Edit3, Languages } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const LanguagePicker = () => {
    const { selectedLanguage, setSelectedLanguage, editor } = useSurveyEditor();
    const navigate = useNavigate();

    // Get available locales from the survey, default to English if none available
    const availableLocales = editor?.survey?.locales || [];
    if (availableLocales.length < 1) {
        availableLocales.push('en')
    }

    useEffect(() => {
        if (selectedLanguage && !availableLocales.includes(selectedLanguage)) {
            setSelectedLanguage(availableLocales.at(0) ?? 'en')
        }
    }, [availableLocales, selectedLanguage])

    const handleEditLanguages = () => {
        navigate("/editor/translation-mode");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                variant="outline"
                size="sm"
                 className="gap-2 border-border rounded-xl h-[30px] text-muted-foreground text-xs"
                 >
                    <Languages className="size-3.5" />
                    {selectedLanguage ? selectedLanguage : 'en'}
                    <ChevronDown className="size-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-border">
                <DropdownMenuLabel>Languages:</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={selectedLanguage ?? 'en'} onValueChange={setSelectedLanguage}>
                    {availableLocales.length < 1 && <p className="text-muted-foreground text-xs px-4 py-2">No languages available</p>}
                    {availableLocales.map((locale) => (
                        <DropdownMenuRadioItem key={locale} value={locale}>
                            {locale}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleEditLanguages}>
                    <Edit3 className="size-4 mr-2" />
                    Edit languages
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguagePicker;
