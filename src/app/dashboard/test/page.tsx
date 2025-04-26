"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { testEventAPI } from '@/hooks/useEvents';
import { useToast } from '@/components/ui/use-toast';

export default function TestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const runTests = async () => {
    setLoading(true);
    const results = [];

    // API çağrısı testi
    const apiTest = await testEventAPI.testSuccessfulAPICall();
    results.push({
      name: 'API Çağrısı Testi',
      ...apiTest
    });

    // Hata yönetimi testi
    const errorTest = await testEventAPI.testErrorHandling();
    results.push({
      name: 'Hata Yönetimi Testi',
      ...errorTest
    });

    // Token yönetimi testi
    const tokenTest = await testEventAPI.testTokenManagement();
    results.push({
      name: 'Token Yönetimi Testi',
      ...tokenTest
    });

    setTestResults(results);
    setLoading(false);

    // Test sonuçlarını göster
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    toast({
      title: 'Test Sonuçları',
      description: `${successCount}/${totalCount} test başarılı`,
      variant: successCount === totalCount ? 'default' : 'destructive'
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">API Test Sayfası</h1>
      
      <Button 
        onClick={runTests} 
        disabled={loading}
        className="mb-6"
      >
        {loading ? 'Testler Çalışıyor...' : 'Testleri Çalıştır'}
      </Button>

      <div className="space-y-4">
        {testResults.map((result, index) => (
          <Card key={index} className="p-4">
            <h3 className="font-semibold mb-2">{result.name}</h3>
            <p className={result.success ? 'text-green-600' : 'text-red-600'}>
              {result.message}
            </p>
            {result.error && (
              <pre className="mt-2 p-2 bg-gray-100 rounded text-sm">
                {JSON.stringify(result.error, null, 2)}
              </pre>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
} 