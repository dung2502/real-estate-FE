declare module '@heroicons/react/outline' {
    import * as React from 'react';

    export interface IconProps extends React.SVGProps<SVGSVGElement> {
        title?: string;
        titleId?: string;
    }

    export const AcademicCapIcon: React.FC<IconProps>;
    export const AdjustmentsIcon: React.FC<IconProps>;
    export const AnnotationIcon: React.FC<IconProps>;
    export const ArchiveIcon: React.FC<IconProps>;
    // Thêm các icon khác bạn dùng...
}
