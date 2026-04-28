'use client'
import React from 'react'
import { TopBar } from '@/components/admin/TopBar'
import { CommercantTable } from '@/components/admin/CommercantTable'
import { Button } from '@/components/ui/Button'
import { Download, UserPlus } from 'lucide-react'

export default function CommercantPage() {
  return (
    <>
      <TopBar title="Commerçants" />
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-7 lg:py-6 max-w-[1120px] mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 flex-wrap">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-[22px] lg:text-[32px] font-semibold tracking-[-0.02em] m-0">
              Registre des commerçants
            </h1>
            <div className="text-sm text-[var(--fg-3)] mt-1">412 inscrits · Marché Cocovico (pilote)</div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="ghost" className="hidden sm:inline-flex"><Download size={16} />Export CSV</Button>
            <Button variant="primary">
              <UserPlus size={16} />
              <span className="hidden sm:inline">Nouveau commerçant</span>
              <span className="sm:hidden">Nouveau</span>
            </Button>
          </div>
        </div>

        <CommercantTable />
      </div>
    </>
  )
}
