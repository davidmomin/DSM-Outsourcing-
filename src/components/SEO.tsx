import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
}

export default function SEO({
    title = "DSM Outsourcing & Computer Training Center | Ultimate Edition 2026",
    description = " Dhaka's premium computer training center. Learn freelancing, AI, and IT skills locally in Bangladesh. Trusted, SEO-optimized, and local-first.",
    keywords = "computer training Dhaka, freelancing course Bangladesh, AI course Dhaka, DSM Outsourcing"
}: SEOProps) {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "DSM Outsourcing & Computer Training Center",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Dhaka",
            "addressCountry": "BD"
        },
        "url": "https://dsmoutsourcing.com",
        "logo": "https://dsmoutsourcing.com/logo.png"
    };

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://dsmoutsourcing.com" />

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />

            {/* JSON-LD */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
}
