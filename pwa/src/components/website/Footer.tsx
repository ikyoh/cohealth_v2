import Link from "next/link";

export default function Footer() {

    return (
        <footer>
            <div className="max-w-5xl bg-muted mt-10 mb-5 flex items-center justify-between rounded-md p-4 px-6 py-3 container mx-auto">
                <span className="text-title">&copy; CoHealth 2025</span>
                <Link href="#" className="text-muted-foreground hover:text-primary text-sm">
                    Mentions légales
                </Link>
            </div>
        </footer>
    )
}
