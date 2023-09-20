import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Button } from "@nextui-org/button";
import { BsInfoCircle } from "react-icons/bs";
import { Card, CardBody } from "@nextui-org/card";


const TwoColumnsWithCards: React.FC<{
    label: string, description: string,
    infoboxContent?: React.ReactNode,
    children: React.ReactNode
}> = (props) => {
    return (
        <div className='flex flex-col sm:flex-row gap-4 my-6 group'>
            <div className='min-w-[300px] w-full sm:w-[300px]'>
                <h3 className='text-xl font-bold'>{props.label}
                    {props.infoboxContent && (

                        <Popover placement="bottom-start"
                            backdrop="blur"
                        >
                            <PopoverTrigger>
                                <Button variant='light' size="sm"
                                    isIconOnly
                                    aria-label="Show additional info"
                                >
                                    <BsInfoCircle />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="max-w-[500px]">
                                {props.infoboxContent}
                            </PopoverContent>
                        </Popover>
                    )
                    }
                </h3>
                <p className='text-sm text-gray-500 group-hover:text-foreground'>{props.description}</p>

            </div>
            <Card
                className='bg-white/70 flex-1'
                isBlurred
            >
                <CardBody>
                    {props.children}
                </CardBody>
            </Card>
        </div>
    );
}

export default TwoColumnsWithCards;
